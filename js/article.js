(function () {
  var stories = window.MAGAZINE_STORIES || [];
  if (!stories.length) return;

  var params = new URLSearchParams(window.location.search);
  var requested = params.get('id');
  var index = stories.findIndex(function (story) { return story.id === requested; });
  if (index === -1) index = 0;
  var story = stories[index];

  function byId(id) { return document.getElementById(id); }
  function setText(id, value) { var el = byId(id); if (el) el.textContent = value; }

  document.title = story.title + ' — LEONARDO';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', story.deck);

  setText('article-category', story.category);
  setText('article-issue', 'Project N° 01');
  setText('article-number', 'Project ' + story.number);
  setText('article-title', story.title);
  setText('article-deck', story.deck);
  setText('article-author', story.author);
  setText('article-date', story.date);
  setText('article-time', story.readTime);

  var hero = byId('article-image');
  hero.src = story.image;
  hero.alt = story.imageAlt;
  setText('article-image-caption', 'From the Leonardo archive — ' + story.category.toLowerCase());

  var body = byId('article-body');
  var toc = byId('article-toc');
  var headings = [];

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  story.blocks.forEach(function (block) {
    if (block.type === 'lead' || block.type === 'p') {
      body.appendChild(element('p', block.type === 'lead' ? 'article-lead' : '', block.text));
    } else if (block.type === 'h2') {
      var heading = element('h2', '', block.text);
      heading.id = 'part-' + (headings.length + 1);
      body.appendChild(heading);
      headings.push(heading);
      var link = element('a', '', block.text);
      link.href = '#' + heading.id;
      toc.appendChild(element('li', '', '')).appendChild(link);
    } else if (block.type === 'quote') {
      var quote = element('blockquote', 'article-quote');
      quote.appendChild(element('p', '', '“' + block.text + '”'));
      quote.appendChild(element('cite', '', block.cite));
      body.appendChild(quote);
    } else if (block.type === 'image') {
      var figure = element('figure', 'article-figure');
      var img = element('img');
      img.src = block.src;
      img.alt = block.alt;
      img.loading = 'lazy';
      figure.appendChild(img);
      figure.appendChild(element('figcaption', '', block.caption));
      body.appendChild(figure);
    } else if (block.type === 'list') {
      var list = element('ul', 'article-list');
      block.items.forEach(function (item) { list.appendChild(element('li', '', item)); });
      body.appendChild(list);
    }
  });

  if (window.MagazineReveal) window.MagazineReveal.observe(body);

  var next = stories[(index + 1) % stories.length];
  var nextLink = byId('next-story');
  nextLink.href = 'story.html?id=' + encodeURIComponent(next.id);
  setText('next-title', next.title);

  var grid = byId('related-grid');
  stories.filter(function (item) { return item.id !== story.id; }).slice(0, 3).forEach(function (item) {
    var card = element('a', 'related-card');
    card.href = 'story.html?id=' + encodeURIComponent(item.id);
    var imageWrap = element('div', 'related-image');
    var img = element('img');
    img.src = item.image;
    img.alt = item.imageAlt;
    img.loading = 'lazy';
    imageWrap.appendChild(img);
    card.appendChild(imageWrap);
    card.appendChild(element('p', 'story-meta', item.category + ' · ' + item.readTime));
    card.appendChild(element('h3', '', item.title));
    grid.appendChild(card);
  });

  var copyButton = byId('copy-link');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var label = copyButton.innerHTML;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          copyButton.textContent = 'Link copied ✓';
          setTimeout(function () { copyButton.innerHTML = label; }, 2200);
        });
      } else {
        copyButton.textContent = window.location.href;
        setTimeout(function () { copyButton.innerHTML = label; }, 3000);
      }
    });
  }

  if ('IntersectionObserver' in window && headings.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var links = toc.querySelectorAll('a');
        links.forEach(function (link) { link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(function (heading) { observer.observe(heading); });
  }
})();
