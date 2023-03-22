import * as fs from 'fs';
import fetch from 'node-fetch';
import { Participants } from './get-address';
import { BLUE, DEFAULT, RED } from './terminal-colors';

console.clear();
console.log(`\n\nRunning ${BLUE}get-address.ts${DEFAULT}...`);

try {
  let dict = JSON.parse(fs.readFileSync('scripts/address-list.json', 'utf-8')) as Participants;

  getCompanyData$(dict['wikimaki'].address[0]);
  // getCompanyData$('R. Francisco Rocha, 679');
} catch (e) {
  console.log(
    `\n\t🏃 File ${BLUE}address-list.json${DEFAULT} ${RED}could not be parsed${DEFAULT}:\n`,
    e,
  );
}

async function getCompanyData$(query: string) {
  if (!query) throw new Error(`Invalid query: ${query}`);

  query = query.split(' - ')[0];

  console.log(`>> Querying: ${BLUE}${query}${DEFAULT}`);
  // ?q=135+pilkington+avenue,+birmingham&format=json&polygon=1&addressdetails=1
  const params = new URLSearchParams({
    q: `brazil, curitiba, ${query}`,
    // country: 'brazil',
    // city: 'curitiba',
    format: 'json',
  });
  return await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
    .then(res => res.json())
    .then(res => console.log('res:', res));
}
