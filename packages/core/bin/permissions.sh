sudo chown $(whoami):$(id -gn) ./ -R
sudo chmod 664 -R ./
sudo find ./ -type f -name "*.sh" -exec chmod +x {} \;
sudo find ./ -type d -exec chmod +x {} \;