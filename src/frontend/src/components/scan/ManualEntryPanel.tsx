import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Keyboard } from 'lucide-react';

interface ManualEntryPanelProps {
  onSubmit: (data: string) => void;
  disabled?: boolean;
}

export default function ManualEntryPanel({ onSubmit, disabled }: ManualEntryPanelProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="manual-code">Or enter QR code manually</Label>
        <Input
          id="manual-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste or type QR code"
          disabled={disabled}
        />
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={disabled || !code.trim()}>
        <Keyboard className="w-4 h-4 mr-2" />
        Submit Code
      </Button>
    </form>
  );
}
