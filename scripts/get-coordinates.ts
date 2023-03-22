import * as fs from 'fs';
import fetch from 'node-fetch';
import { Participants } from './get-address';
import { BLUE, DEFAULT, RED } from './terminal-colors';

console.clear();
console.log(`\n\nRunning ${BLUE}get-address.ts${DEFAULT}...`);

try {
  let dict = JSON.parse(fs.readFileSync('scripts/address-list.json', 'utf-8')) as Participants;

  for (const key in dict) {
    const participant = dict[key];
    console.log(`>> Iterating participant: ${key}`);
    for (const addr of participant.address) {
      const query = addr?.trim();
      if (!query) {
        console.warn(`\t>> No address found`);
        break;
      }
      participant.data ??= [];
      const [res] = (await getCompanyData$(query)) as any;
      console.log(res);
      participant.data.push({
        query,
        display_name: res.display_name,
        lat: res.lat,
        lon: res.lon,
      });
      console.log(participant.data);
    }
    fs.writeFileSync('scripts/address-list.json', JSON.stringify(dict, null, 2), 'utf-8');
  }

  // getCompanyData$(dict['wikimaki'].address[0]);
  // getCompanyData$('R. Francisco Rocha, 679');
} catch (e) {
  console.log(
    `\n\t🏃 File ${BLUE}address-list.json${DEFAULT} ${RED}could not be parsed${DEFAULT}:\n`,
    e,
  );
}

async function getCompanyData$(query: string) {
  if (!query) throw new Error(`Invalid query: ${query}`);

  const q = `${query.split(' - ')[0]}, Curitiba, Brazil`;

  console.log(`>> Querying: ${BLUE}${q}${DEFAULT}`);
  // ?q=135+pilkington+avenue,+birmingham&format=json&polygon=1&addressdetails=1
  const params = new URLSearchParams({
    q,
    // country: 'brazil',
    // city: 'curitiba',
    format: 'json',
  });
  return await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
    .then(res => res.json())
    // .then(res => {
    //   console.log('res:', res);
    // })
    .catch(e => {
      console.error('\t>> Request error:', e)
    });
}
