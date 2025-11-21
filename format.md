# Challenge Name:
And Crafting Sellcode

## Description: 
Welcome to our shellcode crafting workshop! We've implemented a state-of-the-art security filter to protect against malicious code. Your mission is simple: craft shellcode that spawns a shell and read the flag.
But here's the twist... something seems off with our filter. The letter 'h' keeps disappearing from everything! Even our challenge title got affected - it's "Sellcode" instead of "Shellcode"! 🤔
Can you figure out what's being filtered and craft a working payload despite the restrictions?

## Category:
Binary Exploitation

## Hint: 
- hint1 ( if no solve after 3 hours ) : 
The filter is checking for a specific byte value that's commonly used in x86-64 instructions. Think about what makes 64-bit assembly different from 32-bit assembly.
If you disassemble common shellcode, you'll notice certain opcodes appear frequently at the start of instructions. The filter is blocking one of these prefixes...

- hint2 ( after 6 hours ) : 
The challenge filters out byte 0x48 (the REX.W prefix in x86-64 architecture).

## File:
./attachments.zip

## Flag:
IONIC{c0ngr4tz_y0u_h4v3_b33n_d33p_d1v3_4b0ut_sh3llc0d3}

## POC:
keep it blank untill the ctf ended.

## Difficulty:
Medium

## Points:

## Author:
envior
