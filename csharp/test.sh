#!/usr/bin/env bash

set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

dotnet run --project $SCRIPT_DIR/csharp.csproj -- $@
