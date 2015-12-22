#pragma once

#include <sstream>
#include <vector>

std::vector<int> factor(int x);

namespace std {
inline std::string to_string(const std::vector<int>& v)
{
    std::stringstream out;
    out << "[";
    for (size_t i = 0; i < v.size(); ++i)
    {
        out << v[i];
        if (i < v.size() - 1)
        {
            out << ", ";
        }
    }
    out << "]";
    return out.str();
}
}
