const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const striptags = require('striptags');
const html = require('html-entities').AllHtmlEntities;

class Crawler {
  constructor() {
    this.baseUrl = 'https://github.com';
  }

  doRequest(requestUri, requestOptions = {}) {
    let uri = this.baseUrl;

    if (requestUri.indexOf(this.baseUrl) !== 0) {
      uri += `${requestUri}`;
    }

    const options = Object.assign({
      uri,
      transform: body => cheerio.load(body, {
        normalizeWhitespace: true,
      }),
    }, requestOptions);

    return requestPromise(options);
  }

  static normalizeLanguage(language) {
    switch (language) {
      case 'js' || 'javascript':
        return 'javascript';
      case 'ts' || 'typescript':
        return 'typescript';
      default:
        return language;
    }
  }

  fetch(language = '') {
    let uri = `/trending/${language}`;

    if (language) {
      uri += `/${Crawler.normalizeLanguage(String(language).toLocaleLowerCase())}`;
    }

    return this.doRequest(uri)
      .then($ => {
        const repoData = [];
        const $repoList = $('ol.repo-list').find('li.col-12.d-block.width-full.py-4.border-bottom');
        $repoList.each((i, el) => {
          const $repoTitle = $(el).children().first().find('h3 > a');
          const $repoSummary = $(el).find('div').eq(2);
          const $repoMetadata = $(el).find('div').eq(3);

          const title = striptags($repoTitle.html()).trim();
          const url = `${this.baseUrl}/${$repoTitle.attr('href')}`;
          const summary = html.decode(striptags($repoSummary.html().replace(/\n/g, '')).trim());
          const programmingLanguage = $repoMetadata.find('span').eq(1).text().trim();
          const stars = $repoMetadata.find('a').first().text().trim();
          const forks = $repoMetadata.find('a').eq(1).text().trim();

          repoData.push({
            title,
            url,
            summary,
            metadata: {
              programmingLanguage,
              stars,
              forks,
            },
          });
        });
      });
  }
}

module.exports = Crawler;
