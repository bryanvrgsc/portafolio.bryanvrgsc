"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Home, Check, Clock } from 'lucide-react';
import { useFileSystem, VFile } from '@/context/FileSystemContext';
import { cn } from '@/lib/utils';

interface TerminalAppProps {
  onOpenFile?: (file: VFile) => void;
  onOpenFolder?: (id: string) => void;
}

interface TerminalLine {
  type: 'input' | 'output';
  content: string | React.ReactNode;
  timestamp?: string;
  path?: string;
}

const getTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase();
};

const AppleLogo = () => (
  <svg viewBox="0 0 384 512" className="w-3 h-3 fill-current">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 86.7 82.8 119.5 23.3 21.6 51.1 46.9 82.2 3.9 30.8-43.9 66.7-43.9 96.1 3.9 30.6 47.5 59.4 18.3 83.3-15.6 15.6-21.9 31.9-50 31.9-50-6.1-9.4-44.4-38.3-46.7-104.4zm-48.9-152.8c19.7-21.4 33.1-50.6 28.1-80.8-23.9 3.6-50.6 18.3-69.4 41.7-16.7 20-32.8 52.8-27.5 81.7 25.8 2.2 51.4-18.9 68.8-42.6z" />
  </svg>
);

const LeftPrompt = ({ path }: { path: string }) => (
  <div className="flex items-center font-bold text-[11px] h-6 select-none shrink-0">
    <div className="bg-[#9ca3af] text-black px-2 h-full flex items-center rounded-l-md relative z-20">
      <AppleLogo />
      <div className="absolute right-[-12px] top-0 h-0 w-0 border-y-[12px] border-y-transparent border-l-[12px] border-l-[#9ca3af] z-20" />
    </div>
    <div className="bg-[#3b82f6] text-white pl-4 pr-2 h-full flex items-center relative ml-[0px] z-10">
      <Home size={12} className="mr-1" />
      <span>{path}</span>
      <div className="absolute right-[-12px] top-0 h-0 w-0 border-y-[12px] border-y-transparent border-l-[12px] border-l-[#3b82f6]" />
    </div>
  </div>
);

const RightPrompt = ({ timestamp }: { timestamp?: string }) => {
  const time = timestamp || getTime();
  return (
    <div className="flex items-center font-bold text-[11px] h-6 select-none ml-auto shrink-0 gap-1 opacity-90">
      <div className="bg-[#1e293b] text-green-500 px-2 h-full flex items-center rounded-l-full relative">
        <Check size={12} />
      </div>
      <div className="bg-[#d1d5db] text-black px-3 h-full flex items-center rounded-r-full relative -ml-1">
        <span className="mr-1">{time}</span>
        <Clock size={12} />
      </div>
    </div>
  );
};

const TerminalApp = React.memo(({ onOpenFile, onOpenFolder }: TerminalAppProps) => {
  const { fs } = useFileSystem();
  const [history, setHistory] = useState<TerminalLine[]>(() => {
    // Initial state logic moved here to avoid useEffect setState error
    const now = new Date();
    const dateStr = now.toString().split(' ').slice(0, 4).join(' ') + ' ' + now.toTimeString().split(' ')[0];
    return [{ type: 'output', content: `Last login: ${dateStr} on console` }];
  });
  const [input, setInput] = useState('');
  const [cwdId, setCwdId] = useState<string | null>(null); // null is ~ (home root)
  const bottomRef = useRef<HTMLDivElement>(null);

  // Command History State
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Helper to get current directory object (derived state)
  // const currentDir = useMemo(() => fs.find(f => f.id === cwdId), [fs, cwdId]); // Unused

  // Helper to get path string for prompt
  const getPathString = (id: string | null): string => {
    if (!id) return '~';
    const folder = fs.find(f => f.id === id);
    if (!folder) return '~';
    return folder.name;
  };

  // Helper for full PWD path
  const getFullPath = (id: string | null): string => {
    if (!id) return '/Users/bryanvargas';
    const path: string[] = [];
    let currId = id;
    while (currId) {
      const folder = fs.find(f => f.id === currId);
      if (folder) {
        path.unshift(folder.name);
        currId = folder.parentId as string;
      } else {
        break;
      }
    }
    return '/Users/bryanvargas/' + path.join('/');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Save to command history
    setCmdHistory(prev => [...prev, trimmedInput]);
    setHistoryPointer(-1);

    const args = trimmedInput.split(/\s+/);
    const cmd = args[0].toLowerCase();
    let response: string | React.ReactNode = '';
    const currentTime = getTime();
    const currentPath = getPathString(cwdId);

    switch (cmd) {
      case 'help':
        response = 'Available commands: help, ls, cd [dir], pwd, open [file/dir], whoami, date, clear, uname';
        break;
      case 'ls':
        const files = fs.filter(f => f.parentId === cwdId);
        if (files.length === 0) {
          response = '';
        } else {
          response = (
            <div className="flex flex-wrap gap-x-4">
              {files.map(f => (
                <span key={f.id} className={cn(
                  "font-bold",
                  f.type === 'folder' ? "text-blue-400" : "text-white"
                )}>
                  {f.name}{f.type === 'folder' ? '/' : ''}
                </span>
              ))}
            </div>
          );
        }
        break;
      case 'cd':
        const target = args[1];
        if (!target || target === '~') {
          setCwdId(null);
        } else if (target === '..') {
          if (cwdId) {
            const parent = fs.find(f => f.id === cwdId)?.parentId;
            setCwdId(parent || null);
          }
        } else {
          const folder = fs.find(f => f.parentId === cwdId && f.name.toLowerCase() === target.toLowerCase() && f.type === 'folder');
          if (folder) {
            setCwdId(folder.id);
          } else {
            response = `cd: no such file or directory: ${target}`;
          }
        }
        break;
      case 'open':
        const fileTarget = args[1];
        if (!fileTarget) {
          response = 'Usage: open [filename]';
        } else {
          const file = fs.find(f => f.parentId === cwdId && f.name.toLowerCase() === fileTarget.toLowerCase());
          if (file) {
            if (file.type === 'folder') {
              onOpenFolder?.(file.id);
            } else {
              onOpenFile?.(file);
            }
          } else {
            response = `open: ${fileTarget}: No such file or directory`;
          }
        }
        break;
      case 'pwd':
        response = getFullPath(cwdId);
        break;
      case 'whoami':
        response = 'bryanvargas';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'uname':
        response = 'Darwin';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = `zsh: command not found: ${cmd}`;
    }

    setHistory(prev => [...prev,
    { type: 'input', content: trimmedInput, timestamp: currentTime, path: currentPath },
    ...(response !== '' ? [{ type: 'output', content: response } as TerminalLine] : [])
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;

      const newPointer = Math.min(historyPointer + 1, cmdHistory.length - 1);
      setHistoryPointer(newPointer);
      setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;

      const newPointer = Math.max(historyPointer - 1, -1);
      setHistoryPointer(newPointer);

      if (newPointer === -1) {
        setInput('');
      } else {
        setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const tokens = input.split(' ');
      const lastToken = tokens[tokens.length - 1];

      if (!lastToken) return;

      // Determine context (commands or files)
      let candidates: string[] = [];

      if (tokens.length === 1) {
        // Commands
        const commands = ['help', 'ls', 'cd', 'pwd', 'whoami', 'date', 'clear', 'uname'];
        candidates = [...commands];
        // And files in current dir (executable context simulation)
        const files = fs.filter(f => f.parentId === cwdId).map(f => f.name);
        candidates = [...candidates, ...files];
      } else {
        // Files only
        const files = fs.filter(f => f.parentId === cwdId).map(f => f.name + (f.type === 'folder' ? '/' : ''));
        candidates = files;
      }

      const matches = candidates.filter(c => c.toLowerCase().startsWith(lastToken.toLowerCase()));

      if (matches.length === 1) {
        // Complete it
        tokens[tokens.length - 1] = matches[0];
        setInput(tokens.join(' '));
      } else if (matches.length > 1) {
        // Optional: Show common prefix? For now just cycle or do nothing
        // Simple "zsh" style: if common prefix exists, complete to it.
        // Simplified: Just match the first one to avoid complexity
        // Better: List them?
        // Let's implement simple first-match completion for now
        tokens[tokens.length - 1] = matches[0];
        setInput(tokens.join(' '));
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      // Cancel current command
      const currentTime = getTime();
      const currentPath = getPathString(cwdId);
      setHistory(prev => [...prev, { type: 'input', content: input + '^C', timestamp: currentTime, path: currentPath }]);
      setInput('');
      setHistoryPointer(-1);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className="h-full bg-[#1c1c1e] text-white font-mono text-[13px] p-2 overflow-auto leading-normal selection:bg-white/20"
      style={{ fontFamily: "MesloLGS NF, Menlo, Monaco, 'Courier New', monospace" }}
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="min-h-[1.5em] w-full mb-1">
          {line.type === 'input' ? (
            <div className="flex items-center w-full gap-3">
              <LeftPrompt path={line.path || '~'} />
              <span className="break-all">{line.content as string}</span>
              <div className="flex-1" />
              <RightPrompt timestamp={line.timestamp} />
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">{line.content}</div>
          )}
        </div>
      ))}
      <div className="flex items-center w-full gap-3 mt-1">
        <LeftPrompt path={getPathString(cwdId)} />
        <div className="flex-1 relative">
          <form onSubmit={handleCommand} className="flex">
            <input
              id="term-input"
              autoFocus
              autoComplete="off"
              className="bg-transparent border-none outline-none text-white w-full min-w-[10px] caret-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Entrada de terminal"
            />
          </form>
        </div>
        <RightPrompt />
      </div>
      <div ref={bottomRef} className="pb-4" />
    </div>
  );
});

TerminalApp.displayName = 'TerminalApp';

export default TerminalApp;
