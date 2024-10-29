const { JSDOM } = require('jsdom');
const marked = require('marked');
const logger = require('../utils/logger');

class MobiledocService {
  static convert(content, source) {
    logger.info('Converting to Mobiledoc:', { content, source });
    let htmlContent = content;

    if (source === 'markdown') {
      htmlContent = marked.parse(content);
    } else if (source !== 'html') {
      throw new Error(`Invalid source type: ${source}. Expected 'html' or 'markdown'.`);
    }

    logger.debug('HTML content:', htmlContent);

    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const mobiledoc = {
      version: '0.3.1',
      markups: [],
      atoms: [],
      cards: [],
      sections: [],
    };

    document.body.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const tagName = node.tagName.toLowerCase();
        mobiledoc.sections.push([1, tagName, [[0, [], 0, node.textContent]]]);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        mobiledoc.sections.push([1, 'p', [[0, [], 0, node.textContent.trim()]]]);
      }
    });

    logger.debug('Mobiledoc result:', mobiledoc);
    return mobiledoc;
  }
}

module.exports = MobiledocService;
