This dir was intended to be used to allow me to delete related org data to recreate an org when I got a duplicate error.

1.) `bash watch.sh`
2.) ```bash
curl -sX POST <https://pipergraggclouddev.helpapp.io/v1/registration> \
-H 'Content-Type: application/json' \
-d '{
  "name": "abc'$(date +%s)'",
  "email": "abc'$(date +%s)'@kustomer.com",
  "domain": "abc'$(date +%s)'"
}'

```
3.) `bash delete.sh`
