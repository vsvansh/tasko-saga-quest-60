
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Bell, Moon, Sun, LogOut, Heart } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface ProfileProps {
  userName?: string;
}

const Profile: React.FC<ProfileProps> = ({ userName = 'User' }) => {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    setOpen(false);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully."
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open profile">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">Account</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center gap-3 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <p className="text-muted-foreground text-sm">{email}</p>
                    <div className="flex gap-2 mt-2 justify-center">
                      <Badge variant="outline" className="bg-primary/10">Free Plan</Badge>
                      <Badge variant="outline" className="bg-primary/10">3 Tasks</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Your email" 
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} className="w-full">
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for task reminders
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive task updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Archive</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically archive completed tasks
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button onClick={handleSaveSettings} className="w-full mt-4">
                  Save Settings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-base">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      className="justify-start" 
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      className="justify-start" 
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"} 
                      className="justify-start" 
                      onClick={() => setTheme("system")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable UI animations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Heart className="h-4 w-4 text-anime-red" />
              Support
            </Button>
            <Button variant="outline" className="text-destructive flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
