'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 lg:pl-64">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
            <div className="mb-6">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Späť
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mb-2">Nastavenia</h1>
              <p className="text-muted-foreground">
                Spravujte nastavenia aplikácie a preferencie
              </p>
            </div>

            <div className="space-y-6">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Vzhľad</CardTitle>
                  <CardDescription>
                    Upravte vzhľad aplikácie podľa vašich preferencií
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Téma</Label>
                    <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          <span>Svetlá</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          <span>Tmavá</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          <span>Systém</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Other Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferencie</CardTitle>
                  <CardDescription>
                    Ďalšie nastavenia aplikácie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ďalšie nastavenia budú pridané v budúcnosti.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
