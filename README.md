# sombit888.github.io

Local preview (matches GitHub Pages):

1. Install Ruby (>= 3) and Bundler.
2. From the repo root, run:
	- `bundle install`
	- `bundle exec jekyll serve --livereload --future`
3. Open http://localhost:4000/ (ReVLA lives at http://localhost:4000/ReVLA/).

Notes:
- Main layout: _layouts/default.html; posts: _posts/; thumbnails: tn/images/.
- Config: _config.yml (url/baseurl, plugins).
- Static microsite: ReVLA/ with its own assets under ReVLA/static/.
- Static microsite: ARP/ is a built copy of /media/sombit/Expansion/async_rp/website (edit and rebuild there, then sync with
  `rsync -a --exclude tools/ --exclude README.md --exclude assets/data/ /media/sombit/Expansion/async_rp/website/ ARP/`).
