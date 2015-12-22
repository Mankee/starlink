#include "test_util.h"

std::vector<std::pair<size_t, std::string>> read_file(const std::string& path)
{
    std::ifstream file(path.c_str());
    CHECK(file.is_open(), "Failed to open test case.")
    size_t line_number = 0;
    std::vector<std::pair<size_t, std::string>> lines;
    std::string line;
    while (std::getline(file, line))
    {
        ++line_number;
        line = line.substr(0, line.rfind('#', 0));
        if (!line.empty())
        {
            lines.emplace_back(line_number, line);
        }
    }
    file.close();

    return lines;
}
