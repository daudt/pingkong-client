get_random() {
  echo $(( $RANDOM % ${1} ))
}

get_random_user_id() {
  echo $(get_random 6)
}

get_elo_start() {
  echo $(( $(get_random 100) + 1450 ))
}

create_users() {
  echo "  \"users\": ["
  echo "    {"
  echo "      \"id\": 1,"
  echo "      \"name\": \"Rafael\","
  echo "      \"email\": \"daudt@daudt.com\","
  echo "      \"nickname\": \"Tuca\","
  echo "      \"image\": \"https://scontent-dft4-2.xx.fbcdn.net/v/t1.0-9/1688401_10152134446803290_487310119_n.jpg?oh=8a96a490ca9e4221cbf190e4aecb23b1&oe=58C1426C\""
  echo "    },"
  echo "    {"
  echo "      \"id\": 2,"
  echo "      \"name\": \"Scott\","
  echo "      \"email\": \"sbalay@gmail.com\","
  echo "      \"nickname\": \"ZenBlender\","
  echo "      \"image\": \"https://avatars2.githubusercontent.com/u/1471363?v=3&s=460\""
  echo "    },"
  echo "    {"
  echo "      \"id\": 3,"
  echo "      \"name\": \"Alex\","
  echo "      \"email\": \"akessock@gmail.com\","
  echo "      \"nickname\": \"Keysox\","
  echo "      \"image\": \"https://scontent-dft4-2.xx.fbcdn.net/v/t1.0-9/557930_557548097589943_1576463450_n.jpg?oh=9513622365667f2f9d25cbe1b8085389&oe=58C08B73\""
  echo "    },"
  echo "    {"
  echo "      \"id\": 4,"
  echo "      \"name\": \"Jim\","
  echo "      \"email\": \"jim.casey@gmail.com\","
  echo "      \"nickname\": \"jimcasey\","
  echo "      \"image\": \"https://avatars2.githubusercontent.com/u/1511191?v=3&s=460\""
  echo "    },"
  echo "    {"
  echo "      \"id\": 5,"
  echo "      \"name\": \"Eli\","
  echo "      \"email\": \"eli@example.com\","
  echo "      \"nickname\": \"eklein\","
  echo "      \"image\": \"https://avatars2.githubusercontent.com/u/918620?v=3&s=460\""
  echo "    }"
  echo "  ]"
}

create_ranking() {
  echo "{ \"id\": ${1}, \"userId\": ${2}, \"rating\": ${3}, \"created_at\": \"${4}\" }"
}

rankings=[]
rankings_index=0
add_ranking() {
  rankings[$rankings_index]=$(create_ranking $rankings_index $1 $2 $3)
  rankings_index=$(( $rankings_index + 1 ))
}

create_match() {
  echo "{ \"id\": ${1}, \"created_at\": \"${2}\" }"
}

matches=[]
matches_index=0
add_match() {
  matches[$matches_index]=$(create_match $matches_index $1)
  matches_index=$(( $matches_index + 1 ))
}

create_match_user() {
  echo "{ \"id\": ${1}, \"matchId\": ${2}, \"userId\": ${3} }"
}

match_users=[]
match_users_index=0
add_match_user() {
  match_users[$match_users_index]=$(create_match_user $match_users_index $matches_index $1)
  match_users_index=$(( $match_users_index + 1 ))
}

create_winner() {
  echo "{ \"id\": ${1}, \"matchId\": ${2}, \"userId\": ${3} }"
}

winners=[]
winners_index=0
add_winner() {
  winners[$winners_index]=$(create_winner $winners_index $matches_index $1)
  winners_index=$(( $winners_index + 1 ))
}

elo=[]
for id in `seq 0 5`; do
  elo[id]=$(get_elo_start)
done

for day in `seq 13 30`; do
  games=$(( $(get_random 5) + 10 ))

  for game in `seq 0 $games`; do
    winner_id=$(get_random_user_id)
    loser_id=$(get_random_user_id)

    if [[ $winner_id != $loser_id ]]; then
      change=$(( $(get_random 20) - 10 ))
      elo[$winner_id]=$(( ${elo[$winner_id]} + $change ))
      elo[$loser_id]=$(( ${elo[$loser_id]} - $change ))

      date="2016-11-${day}T12:00:00Z"

      add_ranking $winner_id ${elo[$winner_id]} $date
      add_ranking $loser_id ${elo[$loser_id]} $date

      add_match_user $winner_id
      add_match_user $loser_id
      add_winner $winner_id
      add_match $date
    fi
  done
done

echo "{"
echo "$(create_users),"

echo "\"rankings\": ["
for i in `seq 0 $(( $rankings_index - 1 ))`; do
  if [[ $i != 0 ]]; then
    echo ","
  fi
  echo "${rankings[$i]}"
done
echo "],"

echo "\"matches\": ["
for i in `seq 0 $(( $matches_index - 1 ))`; do
  if [[ $i != 0 ]]; then
    echo ","
  fi
  echo "${matches[$i]}"
done
echo "],"

echo "\"match_users\": ["
for i in `seq 0 $(( $match_users_index - 1 ))`; do
  if [[ $i != 0 ]]; then
    echo ","
  fi
  echo "${match_users[$i]}"
done
echo "],"

echo "\"winners\": ["
for i in `seq 0 $(( $winners_index - 1 ))`; do
  if [[ $i != 0 ]]; then
    echo ","
  fi
  echo "${winners[$i]}"
done
echo "]"

echo "}"
