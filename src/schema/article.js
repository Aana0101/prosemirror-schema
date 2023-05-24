import { orderedList, bulletList, listItem } from 'prosemirror-schema-list';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-markdown';

// Create the embed node for YouTube videos
class YouTubeEmbed extends Node {
  get name() {
    return 'youtubeEmbed';
  }

  get schema() {
    return {
      attrs: {
        url: {},
      },
      group: 'block',
      selectable: false,
      parseDOM: [
        {
          tag: 'div[data-youtube-url]',
          getAttrs: dom => ({
            url: dom.getAttribute('data-youtube-url'),
          }),
        },
      ],
      toDOM: node => [
        'div',
        {
          'data-youtube-url': node.attrs.url,
          class: 'youtube-embed',
        },
      ],
    };
  }

  static create(attrs) {
    return new YouTubeEmbed(null, attrs);
  }
}

export const fullSchema = new Schema({
  nodes: {
    doc: schema.spec.nodes.get('doc'),
    paragraph: schema.spec.nodes.get('paragraph'),
    blockquote: schema.spec.nodes.get('blockquote'),
    horizontal_rule: schema.spec.nodes.get('horizontal_rule'),
    heading: schema.spec.nodes.get('heading'),
    code_block: schema.spec.nodes.get('code_block'),
    text: schema.spec.nodes.get('text'),
    image: schema.spec.nodes.get('image'),
    youtubeEmbed: YouTubeEmbed,
    hard_break: schema.spec.nodes.get('hard_break'),
    ordered_list: Object.assign(orderedList, {
      content: 'list_item+',
      group: 'block',
    }),
    bullet_list: Object.assign(bulletList, {
      content: 'list_item+',
      group: 'block',
    }),
    list_item: Object.assign(listItem, { content: 'paragraph block*' }),
  },
  marks: {
    link: schema.spec.marks.get('link'),
    em: schema.spec.marks.get('em'),
    superscript: {
      parseDOM: [{ tag: 'sup' }],
      toDOM() {
        return ['sup'];
      },
    },
    strong: schema.spec.marks.get('strong'),
    code: schema.spec.marks.get('code'),
    strike: {
      parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { tag: 'strike' },
        {
          style: 'text-decoration',
          getAttrs: value => value === 'line-through',
        },
      ],
      toDOM: () => ['s', 0],
    },
  },
});

export default fullSchema;
