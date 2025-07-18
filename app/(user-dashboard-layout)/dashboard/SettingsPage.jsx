"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <section className="py-8 flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Profile</h3>
            <div className="flex flex-col gap-2">
              <input className="border rounded px-3 py-2" placeholder="Name" />
              <input className="border rounded px-3 py-2" placeholder="Email" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Preferences</h3>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="darkmode" />
              <label htmlFor="darkmode">Enable Dark Mode</label>
            </div>
          </div>
          <div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Save Changes</button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 