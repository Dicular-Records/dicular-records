/*
 * Decap-Widget "htmlrich": WYSIWYG-Editor, der Texte direkt als HTML bearbeitet.
 *
 * Warum eigenes Widget: Die aus WordPress übernommenen Texte sind HTML (format: html). Der Markdown-Editor
 * von Decap zeigt sie als Code, eine Umwandlung in Markdown verändert das Aussehen (getestet: 5–40 %).
 * Dieses Widget arbeitet auf dem HTML selbst (contenteditable): Nicht bearbeitete Teile bleiben unverändert,
 * die Seite bleibt 1:1. Darstellung im Editor in Schrift und Farben der Website.
 *
 * Einfügen aus anderen Programmen erfolgt bewusst als reiner Text (keine fremden Formatierungen).
 * Der gespeicherte Text wird beim Bauen der Website zusätzlich bereinigt (src/lib/sanitize.ts).
 */
(function () {
  if (!window.CMS || !window.createClass || !window.h) return;
  var h = window.h;

  var TOOLS = [
    { cmd: 'bold', label: 'B', title: 'Fett', style: { fontWeight: 700 } },
    { cmd: 'italic', label: 'I', title: 'Kursiv', style: { fontStyle: 'italic' } },
    { cmd: 'link', label: 'Link', title: 'Link einfügen (Text vorher markieren)' },
    { cmd: 'unlink', label: 'Link weg', title: 'Link entfernen' },
    { cmd: 'insertUnorderedList', label: '• Liste', title: 'Aufzählung' },
    { cmd: 'quote', label: '„ Zitat', title: 'Als Zitat (eingerückt)' },
    { cmd: 'removeFormat', label: 'Format weg', title: 'Fett/Kursiv der Markierung entfernen' },
  ];

  var STYLE =
    '@font-face{font-family:Dosis;font-weight:200;src:url(/wp-content/fonts/dosis/HhyJU5sn9vOmLxNkIwRSjTVNWLEJt7Ml2xMCbKsUPpjl.woff) format("woff")}' +
    '@font-face{font-family:Dosis;font-weight:600;src:url(/wp-content/fonts/dosis/HhyJU5sn9vOmLxNkIwRSjTVNWLEJ6bQl2xMCbKsUPpjl.woff) format("woff")}' +
    '.dicular-rte-toolbar{display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#dfdfe3;border-radius:5px 5px 0 0}' +
    '.dicular-rte-toolbar button{border:0;border-radius:3px;background:#fff;color:#313d3e;padding:6px 10px;font-size:14px;cursor:pointer}' +
    '.dicular-rte-toolbar button:hover{background:#3a69c7;color:#fff}' +
    '.dicular-rte{min-height:260px;max-height:70vh;overflow:auto;padding:24px 28px;background:#00283a;color:#adadad;' +
    'font-family:Dosis,sans-serif;font-weight:200;font-size:19px;line-height:1.6;border-radius:0 0 5px 5px;outline:none}' +
    '.dicular-rte:focus{box-shadow:inset 0 0 0 2px #3a69c7}' +
    '.dicular-rte a{color:#2cc894}.dicular-rte strong,.dicular-rte b{font-weight:600;color:#ddd}' +
    '.dicular-rte blockquote{margin:0 0 1em;padding-left:1em;border-left:4px solid #2a5982}' +
    '.dicular-rte img{max-width:100%;height:auto}.dicular-rte p{margin:0 0 1em}' +
    '.dicular-rte-hint{font-size:12px;color:#798291;margin-top:6px}';

  function injectStyle() {
    if (document.getElementById('dicular-rte-style')) return;
    var s = document.createElement('style');
    s.id = 'dicular-rte-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  var Control = window.createClass({
    componentDidMount: function () {
      injectStyle();
      this.el.innerHTML = this.props.value || '';
      this.last = this.el.innerHTML;
    },
    componentDidUpdate: function () {
      // Wert von außen geändert (z. B. Eintrag gewechselt) → übernehmen, ohne beim Tippen zu stören
      var v = this.props.value || '';
      if (document.activeElement !== this.el && v !== this.last) { this.el.innerHTML = v; this.last = v; }
    },
    emit: function () {
      this.last = this.el.innerHTML;
      this.props.onChange(this.last);
    },
    run: function (cmd, e) {
      e.preventDefault();
      this.el.focus();
      if (cmd === 'link') {
        var url = window.prompt('Link-Adresse (https://…):', 'https://');
        if (!url || url === 'https://') return;
        if (!/^(https?:|mailto:)/i.test(url)) url = 'https://' + url;
        document.execCommand('createLink', false, url);
      } else if (cmd === 'quote') {
        document.execCommand('formatBlock', false, 'blockquote');
      } else {
        document.execCommand(cmd, false, null);
      }
      this.emit();
    },
    onPaste: function (e) {
      // nur reinen Text einfügen; Zeilenumbrüche bleiben erhalten
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text/plain');
      var html = text.split(/\r?\n\r?\n/).map(function (p) {
        return p.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }).replace(/\r?\n/g, '<br>');
      }).join('</p><p>');
      document.execCommand('insertHTML', false, text.indexOf('\n\n') >= 0 ? '<p>' + html + '</p>' : html);
      this.emit();
    },
    render: function () {
      var self = this;
      return h('div', { className: this.props.classNameWrapper, style: { padding: 0, border: 0 } },
        h('div', { className: 'dicular-rte-toolbar' }, TOOLS.map(function (t) {
          return h('button', { key: t.cmd, type: 'button', title: t.title, style: t.style, onMouseDown: function (e) { self.run(t.cmd, e); } }, t.label);
        })),
        h('div', {
          className: 'dicular-rte',
          contentEditable: true,
          suppressContentEditableWarning: true,
          ref: function (el) { self.el = el; },
          onInput: function () { self.emit(); },
          onBlur: function () { self.emit(); },
          onPaste: this.onPaste,
        }),
        h('div', { className: 'dicular-rte-hint' }, 'So ungefähr sieht der Text auf deiner Seite aus. Absatz: Enter · Zeilenumbruch: Shift + Enter')
      );
    },
  });

  var Preview = window.createClass({
    render: function () { return h('div', { dangerouslySetInnerHTML: { __html: this.props.value || '' } }); },
  });

  window.CMS.registerWidget('htmlrich', Control, Preview);
})();
