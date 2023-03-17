import * as fs from 'fs';
import fetch from 'node-fetch';
import { BLUE, DEFAULT, GREEN, RED } from './terminal-colors';

console.clear();
console.log(`\n\nRunning ${BLUE}get-address.ts${DEFAULT}...`);

const dataPath = 'https://touroquefazercuritiba.com.br/participantes';

try {
  let dict: { [id: string]: { address: string[] } } = {};

  const pagedParticipants = (await Promise.all(getParticipants())).filter(items => items.length);

  console.log('>> Found participants: ', JSON.stringify(pagedParticipants));

  for (const participants of pagedParticipants) {
    for (const participant of participants) {
      const entry = { [participant]: { address: await getCompanyData$(participant) } };
      console.log(entry);
      dict = { ...dict, ...entry };
      fs.writeFileSync('scripts/address-list.json', JSON.stringify(dict, null, 2), 'utf-8');
    }
  }

  console.log(
    `\n\t🎉 File ${BLUE}missing-assets.json${DEFAULT} was ${GREEN}successfully generated${DEFAULT}! 🎉`,
  );
} catch (e) {
  console.log(
    `\n\t🏃 File ${BLUE}missing-assets.json${DEFAULT} ${RED}could not be generated${DEFAULT}:\n`,
    e,
  );
}

function getParticipants(): Promise<string[]>[] {
  const participants = [] as Promise<string[]>[];

  for (const page of [...new Array(15)].map((_, i) => i + 1)) {
    console.log('>> Fetching page', page);

    const htmlContent$ = fetch(`https://touroquefazercuritiba.com.br/portfolio/page/${page}`)
      .then(res => res.text())
      .then(content =>
        parseParticipants(content, 'href="https://touroquefazercuritiba.com.br/participantes/'),
      );

    if (!htmlContent$) return participants;

    participants.push(htmlContent$);
  }

  return participants;
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

function getCompanyData$(participant: string) {
  const url = `${dataPath}/${participant}`;
  const match = 'Endereço:';
  return fetch(url)
    .then(res => res.text())
    .then(res =>
      res
        .split('\n')
        .filter(item => item.includes(match))
        .map(item => item.trim().split(match)[1].split('<')[0]),
    );
}
