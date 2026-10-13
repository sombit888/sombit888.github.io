for file in images/*.{jpg,png}; do
    [ ! -f "tn/$file" ] && convert "$file" -background white -alpha remove -alpha off -thumbnail 600x600 -strip -quality 92 "tn/$file"
done
