#include <windows.h>
#include <dbghelp.h>
#pragma comment(lib, "dbghelp.lib")
#include <iostream>
#include <iomanip>

int main() {
    HANDLE hProcess = GetCurrentProcess();
    SymSetOptions(SYMOPT_DEFERRED_LOADS | SYMOPT_LOAD_LINES | SYMOPT_UNDNAME | SYMOPT_DEBUG);
    const char* searchPath = "c:\\Users\\Administrator\\Documents\\prueba\\fluxui\\build\\Release";
    if (!SymInitialize(hProcess, searchPath, FALSE)) {
        std::cerr << "SymInitialize failed: " << GetLastError() << "\n";
        return 1;
    }
    
    // Load the DLL
    const char* dllPath = "c:\\Users\\Administrator\\Documents\\prueba\\fluxui\\build\\Release\\fluxui_shared.dll";
    DWORD64 baseAddr = SymLoadModuleEx(hProcess, NULL, dllPath, NULL, 0x10000000, 0x1000000, NULL, 0);
    std::cout << "baseAddr: 0x" << std::hex << baseAddr << "\n";
    if (!baseAddr) {
        std::cerr << "SymLoadModuleEx failed: " << GetLastError() << "\n";
        return 1;
    }


    
    // Address to resolve
    DWORD64 targetAddr = baseAddr + 0xa32b5;
    
    // Resolve symbol name
    char symbolBuffer[sizeof(SYMBOL_INFO) + MAX_SYM_NAME * sizeof(TCHAR)];
    PSYMBOL_INFO pSymbol = (PSYMBOL_INFO)symbolBuffer;
    pSymbol->SizeOfStruct = sizeof(SYMBOL_INFO);
    pSymbol->MaxNameLen = MAX_SYM_NAME;
    
    DWORD64 displacement = 0;
    if (SymFromAddr(hProcess, targetAddr, &displacement, pSymbol)) {
        std::cout << "Symbol: " << pSymbol->Name << " (+0x" << std::hex << displacement << ")\n";
    } else {
        std::cerr << "SymFromAddr failed: " << GetLastError() << "\n";
    }
    
    // Resolve line info
    IMAGEHLP_LINE64 line = {0};
    line.SizeOfStruct = sizeof(IMAGEHLP_LINE64);
    DWORD displacementLine = 0;
    if (SymGetLineFromAddr64(hProcess, targetAddr, &displacementLine, &line)) {
        std::cout << "File: " << line.FileName << "\n";
        std::cout << "Line: " << std::dec << line.LineNumber << "\n";
    } else {
        std::cerr << "SymGetLineFromAddr64 failed: " << GetLastError() << "\n";
    }
    
    SymCleanup(hProcess);
    return 0;
}
