
JAR_BUILD="back/build/libs/constructor-0.0.1-SNAPSHOT.jar"
HEALTH_URL="http://localhost:8080/actuator/health"
FRONT_DIR="front"
FRONT_PORT=80

if [[ ! -f "$JAR_BUILD" ]]; then
    echo "[Error] file $JAR_BUILD not found"
    exit 1
fi

cleanup() {
    echo
    echo "[Info] Stopping processes..."
    [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID" 2>/dev/null
    [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "[Backend]"
java -jar "$JAR_BUILD" &
BACKEND_PID=$!

MAX_TRIES=30
TRY=0

while (( TRY < MAX_TRIES )); do
    ((TRY++))
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")
    if [[ "$STATUS" == "200" ]]; then
        break
    fi
    sleep 2
done

if (( TRY == MAX_TRIES )); then
    echo "[Error] The backend is not responding after $MAX_TRIES attempts."
    kill "$BACKEND_PID" 2>/dev/null
    exit 1
fi

cd "$FRONT_DIR" || exit 1
echo "[Frontend]"
npx next start -p "$FRONT_PORT" &
FRONTEND_PID=$!
cd ..

echo "[Info] Started"
echo "[Info] Press Ctrl+C to stop."

wait