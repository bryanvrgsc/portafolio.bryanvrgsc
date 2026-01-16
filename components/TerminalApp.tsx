"use client";

import React, { useState, useRef, useEffect } from 'react';

const TerminalApp = React.memo(() => {
  const [history, setHistory] = useState<string[]>(['Welcome to macOS Terminal', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let response = '';

    switch (cmd) {
      case 'help':
        response = 'Available commands: help, ls, whoami, date, clear, uname';
        break;
      case 'ls':
        response = 'Documents  Projects  Downloads  Desktop';
        break;
      case 'whoami':
        response = 'bryanvargas';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'uname':
        response = 'Darwin 23.0.0 (macOS Tahoe)';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = `zsh: command not found: ${cmd}`;
    }

    setHistory([...history, `bryanvargas@MacBook ~ % ${input}`, response]);
    setInput('');
  };

  return (
    <div
      className="h-full bg-[#1e1e1e]/90 text-[#00ff00] font-mono p-4 overflow-auto text-sm"
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="mb-1 whitespace-pre-wrap">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-[#00ff00]">bryanvargas@MacBook ~ %</span>
        <input
          id="term-input"
          autoFocus
          className="bg-transparent border-none outline-none text-[#00ff00] w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
});

TerminalApp.displayName = 'TerminalApp';

export default TerminalApp;
