FROM mongo

COPY mongo.sh /mongo.sh
RUN chmod 777 /mongo.sh

COPY current /current

ENTRYPOINT /mongo.sh