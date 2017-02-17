#!/usr/bin/env bash
sudo apt-get update -y

# PDF Generator
sudo apt-get install -y wkhtmltopdf

# Additional PDF Generator dependencies
sudo apt-get install -y openssl build-essential xorg libssl-dev xvfb

# Need to create an xvfb wrapper around wkhtmltopdf
echo "xvfb-run -a -s \"-screen 0 640x480x16\" wkhtmltopdf \"\$@\"" > ~/wkhtmltopdf.sh
sudo mv ~/wkhtmltopdf.sh /usr/bin/
sudo chmod a+x /usr/bin/wkhtmltopdf.sh

