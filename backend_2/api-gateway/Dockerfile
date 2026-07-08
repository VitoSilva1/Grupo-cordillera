FROM krakend:2.13

COPY krakend.json /etc/krakend/krakend.json

EXPOSE 8088

CMD ["run", "-c", "/etc/krakend/krakend.json"]
