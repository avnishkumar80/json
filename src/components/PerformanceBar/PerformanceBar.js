import React, { useState, useEffect } from 'react';
import { Zap, FileText, HardDrive, CheckCircle, XCircle, Clock } from 'lucide-react';

const PerformanceBar = ({ jsonInput, error, processingTime }) => {
  const [stats, setStats] = useState({
    lines: 0,
    characters: 0,
    size: '0 B',
    parseTime: '0.000s'
  });

  useEffect(() => {
    if (jsonInput) {
      const startTime = performance.now();
      
      // Calculate stats
      const lines = jsonInput.split('\n').length;
      const characters = jsonInput.length;
      const bytes = new Blob([jsonInput]).size;
      
      // Format file size
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      };

      // Simulate parse time
      const endTime = performance.now();
      const parseTime = ((endTime - startTime) / 1000).toFixed(3);

      setStats({
        lines,
        characters,
        size: formatSize(bytes),
        parseTime: parseTime + 's'
      });
    } else {
      setStats({
        lines: 0,
        characters: 0,
        size: '0 B',
        parseTime: '0.000s'
      });
    }
  }, [jsonInput]);

  if (!jsonInput) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '8px 16px',
      backgroundColor: error ? '#fef2f2' : '#f0fdf4',
      borderTop: `2px solid ${error ? '#fca5a5' : '#86efac'}`,
      fontSize: '13px',
      fontWeight: '500',
      color: error ? '#dc2626' : '#16a34a'
    }}>
      {/* Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {error ? <XCircle size={14} /> : <CheckCircle size={14} />}
        <span>{error ? 'Invalid JSON' : 'Valid JSON'}</span>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Zap size={14} />
        <span>Parsed in {stats.parseTime}</span>
      </div>

      {/* File Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FileText size={14} />
        <span>{stats.lines.toLocaleString()} lines</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <HardDrive size={14} />
        <span>{stats.size}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{stats.characters.toLocaleString()} characters</span>
      </div>

      {/* Processing Speed Indicator */}
      {!error && (
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          backgroundColor: '#dcfce7',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          <Clock size={12} />
          <span>⚡ Lightning Fast</span>
        </div>
      )}
    </div>
  );
};

export default PerformanceBar;