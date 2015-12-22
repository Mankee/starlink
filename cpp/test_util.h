#pragma once

#include <chrono>
#include <cstring>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

#define BOLD "\u001b[1m"
#define GRAY "\u001b[38;5;248m"
#define CYAN "\u001b[36m"
#define RED "\u001b[31m"
#define GREEN "\u001b[32m"
#define YELLOW "\u001b[33m"
#define RESET "\u001b[0m"

#define FAIL(...)                                                                                  \
    {                                                                                              \
        printf(RED BOLD "FAIL: " RESET __VA_ARGS__);                                               \
        printf("\n");                                                                              \
        std::exit(1);                                                                              \
    }

#define CHECK(condition, ...)                                                                      \
    if (!(condition))                                                                              \
    {                                                                                              \
        FAIL(__VA_ARGS__);                                                                         \
    }

std::vector<std::pair<size_t, std::string>> read_file(const std::string& path);
