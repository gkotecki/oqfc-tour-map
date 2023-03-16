import * as fs from 'fs';
import fetch from 'node-fetch';
import { BLUE, DEFAULT, GREEN, RED } from './terminal-colors';

console.clear();
console.log(`\n\nRunning ${BLUE}get-address.ts${DEFAULT}...`);

const dataPath = 'https://touroquefazercuritiba.com.br/participantes';

try {
  const portfolioPage = await fetch('https://touroquefazercuritiba.com.br/portfolio/page/1').then(res =>
    res.text(),
  );

  const participants = parseParticipants(
    portfolioPage,
    'href="https://touroquefazercuritiba.com.br/participantes/',
  );

  console.log(participants);

  console.log(await findData$(participants[1]));

  fs.writeFileSync('scripts/address-list.json', JSON.stringify({ participants }, null, 2), 'utf-8');

  console.log(
    `\n\t🎉 File ${BLUE}missing-assets.json${DEFAULT} was ${GREEN}successfully generated${DEFAULT}! 🎉`,
  );
} catch (e) {
  console.log(
    `\n\t🏃 File ${BLUE}missing-assets.json${DEFAULT} ${RED}could not be generated${DEFAULT}:\n`,
    e,
  );
}

function parseParticipants(file: string, match: string): string[] {
  const set = new Set(
    file
      .split('\n')
      .filter(item => item.includes(match))
      .map(item => item.trim().split(match)[1].split('/')[0]),
  );
  return [...set];
}

async function findData$(participant: string) {
  const url = `${dataPath}/${participant}`;
  const match = 'Endereço:';
  const data = await fetch(url)
    .then(res => res.text())
    .then(res =>
      res
        .split('\n')
        .filter(item => item.includes(match))
        .map(item => item.trim().split(match)[1].split('<')[0]),
    );
  return data;
}
