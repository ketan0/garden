#!/usr/bin/env python3

import argparse
import os
from glob import glob
from getpass import getpass

from tqdm import tqdm
import orgparse
from neo4j import GraphDatabase
import re

def scrape_links_text(text, link_type):
    link_regex = rf'\[\[{link_type}:([^\]]*)\](?:\[([^\]]*)\])?\]'
    matches = re.findall(link_regex, text)
    return [match[0] for match in matches]

def scrape_links(org_node, link_type):
    links = []
    if hasattr(org_node, 'get_heading'):
        heading_text = org_node.get_heading(format='raw')
        links += scrape_links_text(heading_text, link_type)
    body_text = org_node.get_body(format='raw')
    links += scrape_links_text(body_text, link_type)
    return links

def create_simple_node(org_node):
    return {
        'id': org_node.get_property('ID'),
        'properties': {
            'title': org_node.get_heading(format='plain'),
            'contents': org_node.get_body(format='plain')
        },
        'children': [child.get_property('ID') for child in org_node.children],
        'document_links': scrape_links(org_node, 'file'),
        'atom_links': scrape_links(org_node, 'id'),
    }

def get_title_contents(root):
    body = root.get_body()
    match = re.match(r'#\+title: (.+)\n([\s\S]*)$', body, re.M | re.IGNORECASE)
    return match.groups() if match else (None, body)

def create_root_node(root, filename):
    title, contents = get_title_contents(root)
    root_node = {
        'filename': filename,
        'properties': {
            'title': title,
            'contents': contents
        },
        'children': [child.get_property('ID') for child in root.children],
        'document_links': scrape_links(root, 'file'),
        'atom_links': scrape_links(root, 'id'),
    }
    return root_node

def extract_nodes(tree, filename):
    return create_root_node(tree[0], filename), [create_simple_node(node) for node in tree[1:]]

def add_root(tx, root_node):
    tx.run('MERGE (root:Document {filename: $root_node.filename}) '
           'SET root += $root_node.properties '

           # TODO: actually these links should be attributed to a "paragraph" element that's a child of the document.
           # can be multiple paragraphs, too.
           # 'WITH root, $root_node.document_links as document_links '
           # 'UNWIND document_links as link_filename '
           # 'MERGE (linked_doc:Document {filename: link_filename}) '
           # 'MERGE (linked_doc)<-[:LINKS_TO]-(root) '

           # 'WITH root, $root_node.atom_links as atom_links '
           # 'UNWIND atom_links as link_id '
           # 'MERGE (linked_atom:Atom {id: link_id}) '
           # 'MERGE (linked_atom)<-[:LINKS_TO]-(root) '

           'WITH root, $root_node.children as children '
           'WITH root, children, range(0, size(children)) as is '
           'UNWIND children as child_id '
           'MERGE (child:Atom {id: child_id}) '
           'MERGE (child)-[r:IN_DOCUMENT]->(root) '
           'WITH collect(r) as rels '
           'WITH rels, range(0, size(rels)) AS is '
           'UNWIND is AS i '
           'WITH rels[i] as rel, i '
           'SET rel.position = i', root_node=root_node)

def add_atoms(tx, nodes):
    tx.run('UNWIND $nodes as row '
           'MERGE (atom:Atom {id: row.id}) '
           'WITH atom, row.children as children '
           'UNWIND children as child_id '
           'MERGE (child:Atom {id: child_id}) '
           'MERGE (child)-[:CHILD_OF]->(atom)', nodes=nodes)
    tx.run('UNWIND $nodes as row '
           'MERGE (atom:Atom {id: row.id}) '
           'WITH atom, row.atom_links as atom_links '
           'UNWIND atom_links as link_id '
           'MERGE (linked:Atom {id: link_id}) '
           'MERGE (linked)<-[:LINKS_TO]-(atom)', nodes=nodes)
    tx.run('UNWIND $nodes as row '
           'MERGE (atom:Atom {id: row.id}) '
           'WITH atom, row.document_links as document_links '
           'UNWIND document_links as link_filename '
           'MERGE (linked:Document {filename: link_filename}) '
           'MERGE (linked)<-[:LINKS_TO]-(atom)', nodes=nodes)
    tx.run('UNWIND $nodes as row '
           'MATCH (atom:Atom {id: row.id}) '
           'SET atom += row.properties ', nodes=nodes)

def document_to_neo4j(root, nodes, driver):
    with driver.session() as session:
        session.write_transaction(add_atoms, nodes)
        session.write_transaction(add_root, root)

def parse_arguments():
    parser = argparse.ArgumentParser(description='Upload directory of org files to neo4j.')
    parser.add_argument('--org_directory', help='Path to directory with org files in it')
    parser.add_argument('--neo4j_db_uri', help='URI for neo4j DB')
    parser.add_argument('--neo4j_db_username', help='username for neo4j DB')
    parser.add_argument('--neo4j_db_password', help='password for neo4j DB')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()
    org_directory = args.org_directory or input('Specify org directory here: ')
    neo4j_db_uri = args.neo4j_db_uri  or os.getenv('NEO4J_DB_URI') or input('Specify Neo4j DB URI here: ')
    neo4j_db_username = args.neo4j_db_username or os.getenv('NEO4J_DB_USER') or input('Specify Neo4j DB username here: ')
    neo4j_db_password = args.neo4j_db_password or os.getenv('NEO4J_DB_PASS') or getpass('Specify Neo4j DB password here: ')
    driver = GraphDatabase.driver(neo4j_db_uri, auth=(neo4j_db_username, neo4j_db_password))
    for org_file in tqdm(glob(os.path.join(os.path.expanduser(org_directory), '*.org'))):
        orgparse_tree = orgparse.load(org_file)
        filename = os.path.basename(org_file)
        root, nodes = extract_nodes(orgparse_tree, filename)
        document_to_neo4j(root, nodes, driver)
    driver.close()
