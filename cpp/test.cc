#include "test_util.h"
#include "util.h"

int main(int argc, char** argv)
{
    CHECK(argc == 3, "USAGE: %s OUT_PATH TEST_CASE", argv[0]);

    for (const auto& [line_number, line] : read_file(argv[2]))
    {
        std::istringstream tokens(line, std::istringstream::in);

        int x = 0;
        CHECK(tokens >> x, "Malformed line.");

        int divisor = 0;
        std::vector<int> expected;
        while (tokens >> divisor)
        {
            expected.emplace_back(divisor);
        }

        const std::vector<int> factors = factor(x);

        printf("%-10d   ->   %s\n", x, to_string(factors).c_str());
        CHECK(factors == expected, "   Expected %s", to_string(expected).c_str());
    }
}
