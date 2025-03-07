CONTAINER="koywe-challenge-psql"

if ! docker info &>/dev/null; then
    echo "Docker is not running"
    exit 1
fi

if ! docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER$"; then
    echo "The container \"$CONTAINER\" not exists"
    exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -q "^$CONTAINER$"; then
    echo "The container \"$CONTAINER\" is not running"
    exit 1
fi

echo "The container \"$CONTAINER\" is up and running"
docker exec -it koywe-challenge-psql psql -U admin -d quotes_db -f /db-scripts/quotes-db.sql
