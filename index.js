import rdf from "@rdfjs/data-model";
import namespace from "@rdfjs/namespace";
import * as sparql from "rdf-sparql-builder";

export const SPARQL_ENDPOINT = "https://sparql.vanderbilt.edu/sparql";

const ns = {
  spr: namespace("http://syriaca.org/prop/reference/"),
  schema: namespace("http://schema.org/"),
  rdfs: namespace("http://www.w3.org/2000/01/rdf-schema#"),
};

const statementNode = rdf.variable("statementNode");
const factoid = rdf.variable("factoid");
const description = rdf.variable("description");

let query = sparql
  .select([factoid, description])
  .distinct()
  .from("<https://spear-prosop.org>")
  .where([
    [statementNode, ns.spr("reference-URL"), factoid],
    sparql.optional([
      [factoid, ns.schema("description"), description],
    ]),
  ])
  .orderBy([[factoid, 'DESC']]);

fetch(`${SPARQL_ENDPOINT}?query=${encodeURIComponent(query.toString())}`, {
      headers: { Accept: 'application/sparql-results+json' }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

