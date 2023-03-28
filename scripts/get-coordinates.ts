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
      const [res] = (await getCompanyData$(query)) as any || [];
      console.log(res);
      if (res) {
        participant.data.push({
          query,
          display_name: res.display_name,
          lat: res.lat,
          lon: res.lon,
        });
        console.log(participant.data);
      } else {
        console.warn(`\t>> No geocoding response`);
      }
    }
    fs.writeFileSync('scripts/address-list.json', JSON.stringify(dict, null, 2), 'utf-8');
  }
} catch (e) {
  console.log(
    `\n\t🏃 File ${BLUE}address-list.json${DEFAULT} ${RED}could not be parsed${DEFAULT}:\n`,
    e,
  );
}

/**
 * Fetch coords from a query string through a geocoding API
 *
 * @example
 * https://nominatim.openstreetmap.org/ui/search.html?q=R.+Prof.+Pedro+Viriato+Parigot+de+Souza%2C+600+-+Mossungu%C3%AA%2C+Curitiba+-+PR%2C+81200-100
 * https://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json&polygon=1&addressdetails=1
 * https://nominatim.org/release-docs/develop/api/Search/
 */
async function getCompanyData$(query: string) {
  if (!query) throw new Error(`Invalid query: ${query}`);

  const q = `${query.split(' - ')[0]}, Curitiba, Brazil`;

  console.log(`>> Querying: ${BLUE}${q}${DEFAULT}`);
  const params = new URLSearchParams({ q, format: 'json' });
  return await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
    .then(res => res.json())
    .catch(e => {
      console.error('\t>> Request error:', e);
    });
}
