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

            <Section title="Favourite Team">
              <div className="flex flex-wrap gap-2 pt-1">
                {FAVORITE_TEAMS.map((team) => (
                  <button
                    key={team}
                    onClick={() => setFavoriteTeam(team)}
                    className={`px-3.5 py-2 rounded-lg text-[12px] font-condensed font-semibold cursor-pointer tracking-[0.5px] transition-all duration-150 border ${
                      favoriteTeam === team
                        ? "bg-[rgba(0,102,51,0.3)] border-[var(--color-neon)] text-[var(--color-neon)]"
                        : "bg-[#111] border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    {team}
                  </button>
                ))}
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

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Match Alerts">
              <SettingRow
                label="Match Start Reminders"
                desc="15 minutes before kick-off"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Live Score Updates"
                desc="Goal alerts and key moments"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Match Result Summary"
                desc="Final score and stats digest"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow
                label="VAR Decisions"
                desc="Alerts when VAR reviews a decision"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
            </Section>

            <Section title="Team & Player">
              <SettingRow
                label="Favourite Team News"
                desc="Transfers, injuries, lineups"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Player Performance Milestones"
                desc="Goals, assists, records"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Transfer Rumours"
                desc="Real-time transfer news"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
            </Section>

            <Section title="Delivery">
              <SettingRow
                label="Email Notifications"
                desc="nafay@siap.analytics"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Push Notifications"
                desc="Browser & mobile push"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow label="Weekly Digest" desc="Every Monday morning">
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow label="Notification Sound">
                <Select options={NOTIFICATION_SOUNDS} defaultValue="Whistle" />
              </SettingRow>
            </Section>
          </div>
        )}

        {/* Appearance Section */}
        {activeSection === "appearance" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Theme">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {THEME_OPTIONS.map((t, i) => (
                  <div
                    key={i}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                      t.active
                        ? "border-[var(--color-neon)] bg-[rgba(0,255,127,0.04)]"
                        : "border-[var(--color-border)] bg-[#111] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    {t.active && (
                      <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-[var(--color-neon)] flex items-center justify-center">
                        <Check size={10} color="#000" strokeWidth={3} />
                      </div>
                    )}
                    <div className="flex gap-1 mb-2.5">
                      {t.colors.map((c, j) => (
                        <div
                          key={j}
                          className="w-4 h-4 rounded border border-[var(--color-border)]"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div
                      className={`text-[12px] font-condensed font-semibold ${
                        t.active
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {t.label}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Accent Color">
              <div className="flex gap-2.5 pt-1">
                {ACCENT_COLORS.map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-150 border-3 ${
                      i === 0 ? "border-white" : "border-transparent"
                    }`}
                    style={{
                      background: c,
                      boxShadow: i === 0 ? `0 0 12px ${c}66` : "none",
                    }}
                  />
                ))}
              </div>
            </Section>

            <Section title="Display Preferences">
              <SettingRow
                label="Compact Mode"
                desc="Reduce spacing and padding"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow
                label="Animate Statistics"
                desc="Enable chart and counter animations"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="Show Team Badges"
                desc="Display club crests in tables"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow label="Match Clock Display">
                <Select
                  options={MATCH_CLOCK_OPTIONS}
                  defaultValue="Minutes only"
                />
              </SettingRow>
              <SettingRow label="Language">
                <Select
                  options={LANGUAGE_OPTIONS}
                  defaultValue="English (UK)"
                />
              </SettingRow>
            </Section>
          </div>
        )}

        {/* Analytics Preferences */}
        {activeSection === "analytics" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Followed Leagues">
              <div className="flex flex-col gap-2">
                {SETTINGS_LEAGUES.map((league) => {
                  const isActive = followedLeagues.includes(league);
                  return (
                    <div
                      key={league}
                      className={`flex items-center justify-between p-3.5 border rounded-lg cursor-pointer transition-all duration-150 ${
                        isActive
                          ? "bg-[rgba(0,102,51,0.1)] border-[#1F4D2E]"
                          : "bg-[#111] border-[#1A1A1A] hover:bg-[#1A1A1A]"
                      }`}
                      onClick={() => toggleLeague(league)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isActive
                              ? "bg-[var(--color-neon)]"
                              : "bg-[var(--color-text-muted)]"
                          }`}
                        />
                        <span
                          className={`text-[13px] font-condensed font-semibold ${
                            isActive
                              ? "text-[var(--color-text)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {league}
                        </span>
                      </div>
                      <Toggle defaultChecked={isActive} />
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Default Metrics">
              <SettingRow
                label="Primary Stat Display"
                desc="Stat shown first in player cards"
              >
                <Select options={PRIMARY_STAT_OPTIONS} defaultValue="Goals" />
              </SettingRow>
              <SettingRow
                label="xG Model"
                desc="Expected goals calculation method"
              >
                <Select
                  options={XG_MODEL_OPTIONS}
                  defaultValue="Advanced (Body Part)"
                />
              </SettingRow>
              <SettingRow
                label="Possession Style Metric"
                desc="PPDA, Press Intensity, or Build-up"
              >
                <Select options={POSSESSION_METRICS} defaultValue="PPDA" />
              </SettingRow>
              <SettingRow
                label="Per 90 Stats"
                desc="Normalise all stats per 90 minutes"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
              <SettingRow
                label="xG Variance Bands"
                desc="Show confidence intervals on charts"
              >
                <Toggle defaultChecked={false} />
              </SettingRow>
              <SettingRow
                label="Heatmaps on Hover"
                desc="Show pitch heatmap on player hover"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
            </Section>

            <Section title="Dashboard Widgets">
              {DASHBOARD_WIDGETS.map((w, i) => (
                <SettingRow key={w} label={w}>
                  <Toggle defaultChecked={i !== 3} />
                </SettingRow>
              ))}
            </Section>
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

        {/* Data & Export */}
        {activeSection === "data" && (
          <div className="animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-7 px-8">
            <Section title="Export Data">
              <div className="grid grid-cols-2 gap-3 mb-2">
                {EXPORT_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="card-hover bg-[#111] border border-[var(--color-border)] rounded-lg py-4 px-4.5 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--color-text)] font-condensed">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[#3A5244] font-condensed mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-[rgba(0,102,51,0.2)] border border-[#006633] rounded text-[9px] font-condensed font-bold text-[var(--color-green)] tracking-[1px]">
                        {item.format}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Download size={12} color="var(--color-green-mid)" />
                      <span className="text-[11px] text-[var(--color-green-mid)] font-condensed font-semibold">
                        EXPORT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Data Retention">
              <SettingRow
                label="Auto-delete History After"
                desc="Old match data cleanup"
              >
                <Select options={DATA_RETENTION_OPTIONS} defaultValue="Never" />
              </SettingRow>
              <SettingRow
                label="Cache Local Data"
                desc="Store data offline for faster access"
              >
                <Toggle defaultChecked={true} />
              </SettingRow>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
