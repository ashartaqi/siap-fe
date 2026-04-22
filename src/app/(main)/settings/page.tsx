"use client";

import React, { useState } from "react";
import { Check, Download } from "lucide-react";
import {
  SETTINGS_SECTIONS,
  FAVORITE_TEAMS,
  SETTINGS_LEAGUES,
  THEME_OPTIONS,
  ACCENT_COLORS,
  TIMEZONE_OPTIONS,
  MATCH_CLOCK_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTIFICATION_SOUNDS,
  EXPORT_ITEMS,
  DATA_RETENTION_OPTIONS,
  PRIMARY_STAT_OPTIONS,
  XG_MODEL_OPTIONS,
  POSSESSION_METRICS,
  DASHBOARD_WIDGETS,
} from "@/lib/constants";
import { SettingsSidebar } from "@/components/ui/settings/SettingsSidebar";
import { Section } from "@/components/common/Section";
import { SettingRow } from "@/components/common/SettingRow";
import { Toggle } from "@/components/common/Toggle";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [favoriteTeam, setFavoriteTeam] = useState("Liverpool");
  const [followedLeagues, setFollowedLeagues] = useState(["Premier League"]);

  const toggleLeague = (league: string) => {
    setFollowedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league],
    );
  };

  return (
    <div className="flex gap-6 max-w-[1100px]">
      {/* Sidebar Nav */}
      <SettingsSidebar
        sections={SETTINGS_SECTIONS}
        activeSection={activeSection}
        onSelect={setActiveSection}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Profile Information">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#003D1F] to-[#00A550] border-3 border-[#006633] flex items-center justify-center text-[26px] font-bold text-[var(--color-neon)] font-display tracking-[2px] shadow-[0_0_20px_rgba(0,255,127,0.15)]">
                  N
                </div>
                <div>
                  <div className="text-[20px] font-display tracking-[2px] text-[var(--color-text)]">
                    NAFAY
                  </div>
                  <div className="text-[11px] text-[#3A5244] font-condensed tracking-[1px] mt-0.5">
                    ADMIN · SIAP ANALYTICS
                  </div>
                  <button className="mt-2 px-3.5 py-1.5 bg-[rgba(0,102,51,0.2)] border border-[#006633] rounded-md text-[var(--color-green)] text-[11px] font-condensed font-semibold cursor-pointer tracking-[1px] hover:bg-[rgba(0,102,51,0.3)] transition-colors">
                    CHANGE AVATAR
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="FIRST NAME"
                  placeholder="First name"
                  defaultValue="Nafay"
                />
                <Input
                  label="LAST NAME"
                  placeholder="Last name"
                  defaultValue="Khan"
                />
              </div>
              <Input
                label="EMAIL ADDRESS"
                placeholder="Email"
                type="email"
                defaultValue="nafay@siap.analytics"
              />
              <div className="mb-4">
                <div className="text-[11px] text-[#3A5244] font-condensed tracking-[1px] mb-1.5">
                  TIMEZONE
                </div>
                <Select
                  options={TIMEZONE_OPTIONS}
                  defaultValue="Asia/Karachi (PKT)"
                  className="w-full"
                />
              </div>
            </Section>

            <div className="flex justify-end gap-2.5">
              <button className="px-5.5 py-2.5 bg-transparent border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] text-[12px] font-condensed font-semibold cursor-pointer hover:bg-[#111] transition-colors">
                CANCEL
              </button>
              <button className="px-5.5 py-2.5 bg-gradient-to-br from-[#006633] to-[#00A550] border-none rounded-lg text-white text-[12px] font-condensed font-bold cursor-pointer tracking-[1px] shadow-[0_4px_16px_rgba(0,165,80,0.25)] hover:shadow-[0_4px_20px_rgba(0,165,80,0.4)] transition-all">
                SAVE CHANGES
              </button>
            </div>
          </div>
        )}

        {/* Privacy */}
        {activeSection === "privacy" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Account Security">
              <SettingRow
                label="Two-Factor Authentication"
                desc="SMS or authenticator app"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow
                label="Login Alerts"
                desc="Email when new device logs in"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <div className="mt-3">
                <div className="text-[11px] text-[#3A5244] font-condensed tracking-[1px] mb-2">
                  CHANGE PASSWORD
                </div>
                <div className="flex flex-col gap-0.5">
                  <Input
                    label="Current password"
                    placeholder="Current password"
                    type="password"
                  />
                  <Input
                    label="New password"
                    placeholder="New password"
                    type="password"
                  />
                  <Input
                    label="Confirm new password"
                    placeholder="Confirm new password"
                    type="password"
                  />
                </div>
                <button className="mt-3 px-5 py-2.5 bg-[rgba(0,102,51,0.2)] border border-[#006633] rounded-lg text-[var(--color-green)] text-[12px] font-condensed font-bold tracking-[1px] cursor-pointer hover:bg-[rgba(0,102,51,0.3)] transition-colors">
                  UPDATE PASSWORD
                </button>
              </div>
            </Section>

            <Section title="Privacy">
              <SettingRow
                label="Public Profile"
                desc="Allow others to view your profile"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow
                label="Analytics Tracking"
                desc="Help improve SIAP with usage data"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Personalised Insights"
                desc="AI-powered match recommendations"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
            </Section>

            <Section title="Danger Zone">
              <div className="p-4 bg-[rgba(255,59,48,0.05)] border border-[rgba(255,59,48,0.2)] rounded-lg">
                <div className="text-[13px] font-semibold text-[#FF3B30] font-condensed mb-1.5">
                  DELETE ACCOUNT
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)] font-body mb-3">
                  Permanently delete your SIAP account and all associated data.
                  This action cannot be undone.
                </div>
                <button className="px-4.5 py-2 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.4)] rounded-lg text-[#FF3B30] text-[11px] font-condensed font-bold tracking-[1px] cursor-pointer hover:bg-[rgba(255,59,48,0.2)] transition-colors">
                  DELETE MY ACCOUNT
                </button>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
