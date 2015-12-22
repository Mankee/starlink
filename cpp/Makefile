CPP=clang++ -std=c++17

.PHONY: clean test

# Build and run all tests.
test: test.out
	../test.sh test.out solution.cc

# Clean outputs.
clean:
	rm -rf *.o test.out

# Build tests.
test.out: *.cc *.h
	$(CPP) -O3 -o test.out $$(ls *.cc | grep -v solution_blank.cc)
