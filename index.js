import rdf from "@rdfjs/data-model";
import namespace from "@rdfjs/namespace";
import * as sparql from "rdf-sparql-builder";

// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX spr: <http://syriaca.org/prop/reference/>
// PREFIX schema: <http://schema.org/>

// SELECT DISTINCT ?factoid ?description
// FROM <https://spear-prosop.org>
// WHERE {

//     ?statementNode spr:reference-URL ?factoid .
//     OPTIONAL {
//       ?factoid schema:description ?description .
//     }
// }
// ORDER BY ?factoid

export const SPARQL_ENDPOINT = "https://sparql.vanderbilt.edu/sparql";

// Setup namespaces
const ns = {
  spr: namespace("http://syriaca.org/prop/reference/"),
  schema: namespace("http://schema.org/"),
  rdfs: namespace("http://www.w3.org/2000/01/rdf-schema#"),
};

// Define the variables used in the query
const statementNode = rdf.variable("statementNode");
const factoid = rdf.variable("factoid");
const description = rdf.variable("description");

// Build the query
let query = sparql
  .select([factoid, description])
  .distinct()
  // Specify the dataset using FROM
  .from("<https://spear-prosop.org>")
  // Add the main triple pattern: ?statementNode spr:reference-URL ?factoid .
  .where([
    [statementNode, ns.spr("reference-URL"), factoid],
    sparql.optional([
      [factoid, ns.schema("description"), description],
    ]),
  ])
  .orderBy([[factoid, 'DESC']]); // Order the results by ?factoid

  // Build the final SPARQL string;

console.log('BEFORE:', query.toString());

// query = `
// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX spr: <http://syriaca.org/prop/reference/>
// PREFIX schema: <http://schema.org/>

// SELECT DISTINCT ?factoid ?description
// FROM <https://spear-prosop.org>
// WHERE {
  
//     ?statementNode spr:reference-URL ?factoid .
//     OPTIONAL {
//       ?factoid schema:description ?description .
//     }
// }
// ORDER BY ?factoid
// `;

// console.log('AFTER:', query);

fetch(`${SPARQL_ENDPOINT}?query=${encodeURIComponent(query.toString())}`, {
      headers: { Accept: 'application/sparql-results+json' }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

// const ns = {
//   ex: namespace('http://example.org/'),
//   rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
// }

// const observation = rdf.variable('observation')
// const date = rdf.variable('date')
// const temperature = rdf.variable('temperature')

// const query = sparql.select([date, temperature])
//   .where([
//     [observation, ns.rdf.type, ns.ex.Observation],
//     [observation, ns.ex.date, date],
//     [observation, ns.ex.temperature, temperature]
//   ])
