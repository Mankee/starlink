#!/bin/bash -e

BIN="$PWD/$1"
SRC="$PWD/$2"
OUT="$(mktemp)"

cd "$(dirname "$0")"

SUBMIT="$([[ -f .submit ]] && cat .submit || true)"
HARNESS="test test.sh cpp/test*.cc cpp/util.h py/test*.py py/util.py ts/test*.ts ts/test*.js ts/util.ts"

function submit() {
    echo -e  '\033[36;1m============================================================'
    echo -e  '                           Finish                           '
    echo -e  '============================================================\033[0m'

    echo -e '\n------------------------------------------------------------\n\n' >> $OUT
    cat $SRC >> $OUT

    if ! git diff spacex --quiet -- $HARNESS; then
        echo -e "\033[31;1mFAIL\033[0m: Revert test harness changes to submit:"
        git diff spacex --stat -- $HARNESS
        echo
        exit 1
    fi

    if [[ -z "$SUBMIT" ]]; then
        echo -e "\033[31;1mFAIL\033[0m: Missing submission link.\n"
        exit 1
    fi

    if ! $(cat "$OUT" | curl --fail -X POST --data-binary @- "$SUBMIT/$PASSED"); then
        echo -e "\033[31;1mFAIL\033[0m: Error submitting solution.\n"
        exit 1
    fi

    if [[ $PASSED == 1 ]]; then
        echo -e "\033[32;1m"
        echo '                                                                   *'
        echo '                                                    +'
        echo '                                          +    +'
        echo '                                   +     +'
        echo '                              +      +'
        echo '   + + + + +              +     +'
        echo '     +        +       +     +'
        echo '        +       + +      +'
        echo '           +   +      +'
        echo '             +      + +'
        echo '         +      +        +'
        echo '      +       +    +        +'
        echo '    +       +         +        +'
        echo '   + + + + +             + + + + +'
        echo
        echo '   _____ _    _  _____ _____ ______  _____ _____ '
        echo '  / ____| |  | |/ ____/ ____|  ____|/ ____/ ____|'
        echo ' | (___ | |  | | |   | |    | |__  | (___| (___  '
        echo '  \___ \| |  | | |   | |    |  __|  \___ \\___ \ '
        echo '  ____) | |__| | |___| |____| |____ ____) |___) |'
        echo ' |_____/ \____/ \_____\_____|______|_____/_____/ '
        echo
        echo '  Your solution has been submitted, but you'
        echo '  may continue to improve and resubmit it!'
        echo -e "\033[0m"
    else
        echo -e "\033[31;1mFAIL\033[0m: Some tests failed.\n\n"
        exit 1
    fi
}

trap submit EXIT

for TEST in test/*.txt; do
    echo -e "\033[36;1m============================================================"
    echo -e "$TEST"
    echo -e "============================================================\033[0m"
    $BIN $OUT $TEST
done
PASSED=1
