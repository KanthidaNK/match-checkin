/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { LandingCardsGrid } from './components/LandingCardsGrid';
import { RoomWorkspaceView } from './components/RoomWorkspaceView';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinPasscodeModal } from './components/JoinPasscodeModal';
import { InteractiveEntryModal } from './components/InteractiveEntryModal';
import { InspectionModal } from './components/InspectionModal';
import { EditAuditedTitleModal } from './components/EditAuditedTitleModal';
import { AuditedRoomsDashboard } from './components/AuditedRoomsDashboard';
import { CheckinSession, RoomContextData, AuditedRoomRecord } from './types';
import { INITIAL_ROOMS, INITIAL_SESSIONS } from './utils';

import { Locale, translateRoomData } from './i18n';

export default function App() {
  // Global Localization State ('th' | 'en') with localStorage persistence
  const [locale, setLocale] = useState<Locale>(() => {
    return (localStorage.getItem('match_checkin_locale') as Locale) || 'th';
  });

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('match_checkin_locale', newLocale);
  };

  // Rooms state with local persistence
  const [rooms, setRooms] = useState<RoomContextData[]>(() => {
    const saved = localStorage.getItem('match_checkin_rooms_v10');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ROOMS;
      }
    }
    return INITIAL_ROOMS;
  });

  // Active room ID: null indicates Landing Page view; string indicates specific room workspace view
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Observer mode flag (Read-Only Audit Mode when entered with AUDIT-XXXX)
  const [isObserverMode, setIsObserverMode] = useState<boolean>(false);

  // Sessions state with local persistence
  const [sessions, setSessions] = useState<CheckinSession[]>(() => {
    const saved = localStorage.getItem('match_checkin_sessions_v9');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SESSIONS;
      }
    }
    return INITIAL_SESSIONS;
  });

  const updateSessions = (newSessions: CheckinSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('match_checkin_sessions_v9', JSON.stringify(newSessions));
  };

  const updateRooms = (newRooms: RoomContextData[]) => {
    setRooms(newRooms);
    localStorage.setItem('match_checkin_rooms_v10', JSON.stringify(newRooms));
  };

  // Modals state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<RoomContextData | null>(null);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isPasscodeModalAuditedOnly, setIsPasscodeModalAuditedOnly] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [inspectedSession, setInspectedSession] = useState<CheckinSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<CheckinSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-13');

  // Search query state for landing room filtering
  const [searchQuery, setSearchQuery] = useState('');

  // Audited Rooms State persisted via localStorage key 'gravitask_audited_rooms'
  const [auditedRooms, setAuditedRooms] = useState<AuditedRoomRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gravitask_audited_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateAuditedRooms = (records: AuditedRoomRecord[]) => {
    setAuditedRooms(records);
    try {
      localStorage.setItem('gravitask_audited_rooms', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  };

  // Audited Tab toggle state & Custom Title modal state
  const [isAuditedTabActive, setIsAuditedTabActive] = useState<boolean>(false);
  const [roomToEditAuditedTitle, setRoomToEditAuditedTitle] = useState<RoomContextData | null>(null);

  // Active Room object if inside room view
  const rawActiveRoom = activeRoomId ? rooms.find((r) => r.roomId === activeRoomId) : null;
  const activeRoom = rawActiveRoom ? translateRoomData(rawActiveRoom, locale) : null;

  // Filtered rooms for landing hub search
  const filteredRooms = rooms
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = (r.titleBilingual?.[locale] || r.title || '').toLowerCase();
      const creator = (r.creatorBilingual?.[locale] || r.creator || '').toLowerCase();
      const location = (r.locationBilingual?.[locale] || r.location || '').toLowerCase();
      return (
        title.includes(q) ||
        creator.includes(q) ||
        location.includes(q) ||
        (r.title && r.title.toLowerCase().includes(q))
      );
    })
    .map((r) => translateRoomData(r, locale));

  // Audited display rooms mapped from stored roomId records
  const auditedDisplayRooms = rooms
    .filter((r) => auditedRooms.some((ar) => ar.roomId === r.roomId))
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const ar = auditedRooms.find((item) => item.roomId === r.roomId);
      const title = (ar?.customTitle || r.titleBilingual?.[locale] || r.title || '').toLowerCase();
      const creator = (r.creatorBilingual?.[locale] || r.creator || '').toLowerCase();
      const location = (r.locationBilingual?.[locale] || r.location || '').toLowerCase();
      return title.includes(q) || creator.includes(q) || location.includes(q);
    })
    .map((r) => translateRoomData(r, locale));

  const translatedRooms = rooms.map((r) => translateRoomData(r, locale));

  // Session Handlers
  const handleSaveSession = (newOrUpdated: CheckinSession) => {
    const sessionToSave = {
      ...newOrUpdated,
      roomId: newOrUpdated.roomId || activeRoomId || undefined,
    };

    const exists = sessions.some((s) => s.id === sessionToSave.id);
    let updatedList: CheckinSession[];
    if (exists) {
      updatedList = sessions.map((s) => (s.id === sessionToSave.id ? sessionToSave : s));
    } else {
      updatedList = [sessionToSave, ...sessions];
    }
    updateSessions(updatedList);
  };

  const handleVerifySession = (sessionId: string) => {
    const updatedList = sessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'verified' as const,
          verifiedBy: activeRoom ? activeRoom.creator : 'ผู้รับรองสองทาง',
          verifiedAt: new Date().toISOString(),
          rejectionReason: undefined,
        };
      }
      return s;
    });
    updateSessions(updatedList);
  };

  const handleRejectSession = (sessionId: string, reason: string) => {
    const updatedList = sessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'rejected' as const,
          rejectionReason: reason,
        };
      }
      return s;
    });
    updateSessions(updatedList);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedList = sessions.filter((s) => s.id !== sessionId);
    updateSessions(updatedList);
  };

  // Unified Room Save Handler (Create & Edit)
  const handleSaveRoom = (savedRoom: RoomContextData) => {
    const exists = rooms.some((r) => r.roomId === savedRoom.roomId);
    if (exists) {
      const updated = rooms.map((r) => (r.roomId === savedRoom.roomId ? savedRoom : r));
      updateRooms(updated);
    } else {
      const updated = [savedRoom, ...rooms];
      updateRooms(updated);
      setActiveRoomId(savedRoom.roomId);
      setIsObserverMode(false);
    }
  };

  const handleJoinRoom = (roomId: string, isObserver?: boolean, observerPasscode?: string) => {
    // Observer Passcode Auto-Persistence Engine
    if (isObserver) {
      const now = new Date().toISOString();
      const targetRoom = rooms.find((r) => r.roomId === roomId);
      const code = observerPasscode || targetRoom?.observerPasscode || 'AUDIT-0000';
      const existingIdx = auditedRooms.findIndex((item) => item.roomId === roomId);
      let updated: AuditedRoomRecord[];
      if (existingIdx >= 0) {
        updated = [...auditedRooms];
        updated[existingIdx] = {
          ...updated[existingIdx],
          passcode: code,
          lastAccessed: now,
        };
      } else {
        updated = [
          {
            roomId,
            passcode: code,
            lastAccessed: now,
          },
          ...auditedRooms,
        ];
      }
      updateAuditedRooms(updated);
    }

    if (isAuditedTabActive && isObserver) {
      // In Audited Dashboard: dynamically update grid without page reload and remain on dashboard
    } else {
      setActiveRoomId(roomId);
      setIsObserverMode(Boolean(isObserver));
    }
  };

  // Handlers for Audited Room custom modifications
  const handleSaveAuditedTitle = (roomId: string, newTitle: string) => {
    const updated = auditedRooms.map((ar) =>
      ar.roomId === roomId ? { ...ar, customTitle: newTitle } : ar
    );
    updateAuditedRooms(updated);
  };

  const handleUpdateAuditColor = (roomId: string, colorId: string) => {
    const updated = auditedRooms.map((ar) =>
      ar.roomId === roomId ? { ...ar, customAuditColor: colorId } : ar
    );
    updateAuditedRooms(updated);
  };

  const handleRemoveAuditedRoom = (roomId: string) => {
    const updated = auditedRooms.filter((ar) => ar.roomId !== roomId);
    updateAuditedRooms(updated);
  };

  // Pinned Rooms State with Local Persistence
  const [pinnedRoomIds, setPinnedRoomIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('match_checkin_pinned_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleTogglePin = (roomId: string) => {
    setPinnedRoomIds((prev) => {
      const next = prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [roomId, ...prev];
      localStorage.setItem('match_checkin_pinned_rooms', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    const updated = rooms.filter((r) => r.roomId !== roomId);
    updateRooms(updated);
    setPinnedRoomIds((prev) => {
      const next = prev.filter((id) => id !== roomId);
      localStorage.setItem('match_checkin_pinned_rooms', JSON.stringify(next));
      return next;
    });
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
      setIsObserverMode(false);
    }
  };

  const handleChangeRoomColor = (roomId: string, colorId: string) => {
    const updated = rooms.map((r) =>
      r.roomId === roomId ? { ...r, themeColor: colorId } : r
    );
    updateRooms(updated);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased flex flex-col selection:bg-slate-200 selection:text-slate-900">
      {/* 1. Brand Identity & Header Controls */}
      <ExecutiveHeader
        locale={locale}
        onLocaleChange={handleLocaleChange}
        onOpenCreateModal={() => {
          setRoomToEdit(null);
          setIsRoomModalOpen(true);
        }}
        onOpenPasscodeModal={() => {
          setIsPasscodeModalAuditedOnly(isAuditedTabActive);
          setIsPasscodeModalOpen(true);
        }}
        isAuditedView={isAuditedTabActive}
        onToggleAuditedView={() => setIsAuditedTabActive((prev) => !prev)}
        onLogoClick={() => {
          setActiveRoomId(null);
          setIsObserverMode(false);
          setIsAuditedTabActive(false);
        }}
        showBackButton={activeRoomId !== null || isAuditedTabActive}
        isInWorkspace={activeRoomId !== null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => {
          if (activeRoomId !== null) {
            setActiveRoomId(null);
            setIsObserverMode(false);
          } else if (isAuditedTabActive) {
            setIsAuditedTabActive(false);
          }
        }}
      />

      {/* 2. Main Layout */}
      <main className="flex-1 w-full">
        {activeRoom ? (
          /* Multi-Member Inspection & Dual-Key Room Workspace View */
          <RoomWorkspaceView
            room={activeRoom}
            rooms={translatedRooms}
            onSwitchRoom={(newRoomId) => {
              setActiveRoomId(newRoomId);
            }}
            sessions={sessions}
            isObserverMode={isObserverMode}
            onBackToLanding={() => {
              setActiveRoomId(null);
              setIsObserverMode(false);
            }}
            onOpenEditRoom={() => {
              setRoomToEdit(activeRoom);
              setIsRoomModalOpen(true);
            }}
            onOpenCheckin={(dateStr) => {
              setSelectedSession(null);
              setSelectedDate(dateStr || '2026-10-13');
              setIsEntryModalOpen(true);
            }}
            onSelectSession={(session) => {
              setInspectedSession(session);
              setIsInspectionModalOpen(true);
            }}
            onVerifySession={handleVerifySession}
            onSaveSession={handleSaveSession}
            locale={locale}
          />
        ) : isAuditedTabActive ? (
          /* Audited Rooms Dashboard with Outlined Breadcrumb Back Button & 3-Icon Actions */
          <AuditedRoomsDashboard
            rooms={auditedDisplayRooms}
            auditedRecords={auditedRooms}
            locale={locale}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBackToMyRooms={() => setIsAuditedTabActive(false)}
            onSelectRoom={(roomId, isObserver) => {
              setActiveRoomId(roomId);
              setIsObserverMode(Boolean(isObserver !== false));
            }}
            onOpenPasscodeModal={() => {
              setIsPasscodeModalAuditedOnly(true);
              setIsPasscodeModalOpen(true);
            }}
            onEditCustomTitle={(room) => setRoomToEditAuditedTitle(room)}
            onRemoveAuditedRoom={handleRemoveAuditedRoom}
            onUpdateAuditColor={handleUpdateAuditColor}
          />
        ) : (
          /* Minimalist Square Cards Landing Grid */
          <LandingCardsGrid
            rooms={filteredRooms}
            onSelectRoom={(roomId, isObserver) => {
              setActiveRoomId(roomId);
              setIsObserverMode(Boolean(isObserver));
            }}
            onEditRoom={(room) => {
              setRoomToEdit(room);
              setIsRoomModalOpen(true);
            }}
            onDeleteRoom={handleDeleteRoom}
            onChangeRoomColor={handleChangeRoomColor}
            pinnedRoomIds={pinnedRoomIds}
            onTogglePin={handleTogglePin}
            locale={locale}
            onOpenPasscodeModal={() => {
              setIsPasscodeModalAuditedOnly(false);
              setIsPasscodeModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Unified Room Create & Edit Modal */}
      <CreateRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setRoomToEdit(null);
        }}
        room={roomToEdit}
        onSaveRoom={handleSaveRoom}
        locale={locale}
      />

      {/* Join Passcode Modal */}
      <JoinPasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        rooms={translatedRooms}
        onJoinRoom={handleJoinRoom}
        locale={locale}
        isAuditedOnly={isPasscodeModalAuditedOnly}
        isAuditedDashboardView={isPasscodeModalAuditedOnly}
      />

      {/* Intermediate Inspection Modal (Read-Only Preview) */}
      {activeRoom && (
        <InspectionModal
          isOpen={isInspectionModalOpen}
          onClose={() => {
            setIsInspectionModalOpen(false);
            setInspectedSession(null);
          }}
          session={inspectedSession}
          clientName={activeRoom.clientName || 'คู่เช็กอิน'}
          isAuditObserverMode={isObserverMode}
          onSave={(updated) => {
            handleSaveSession(updated);
            setInspectedSession(updated);
          }}
          onDelete={(sessionId) => {
            handleDeleteSession(sessionId);
            setIsInspectionModalOpen(false);
            setInspectedSession(null);
          }}
          locale={locale}
        />
      )}

      {/* Calendar Session Item Detail & Edit Modal */}
      {activeRoom && (
        <InteractiveEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          session={selectedSession}
          initialDate={selectedDate}
          defaultSubject={activeRoom.title}
          defaultHourlyRate={activeRoom.hourlyRate}
          currentRole={isObserverMode ? 'observer' : activeRoom.currentRole}
          isAuditObserverMode={isObserverMode}
          hostName={activeRoom.hostName || activeRoom.creator}
          clientName={activeRoom.clientName || 'คู่เช็กอิน'}
          onSaveSession={handleSaveSession}
          onVerifySession={handleVerifySession}
          onRejectSession={handleRejectSession}
          onDeleteSession={handleDeleteSession}
          locale={locale}
        />
      )}

      {/* Restricted Edit Card Title Modal for Audited View */}
      {roomToEditAuditedTitle && (
        <EditAuditedTitleModal
          isOpen={roomToEditAuditedTitle !== null}
          onClose={() => setRoomToEditAuditedTitle(null)}
          roomId={roomToEditAuditedTitle.roomId}
          currentTitle={
            auditedRooms.find((ar) => ar.roomId === roomToEditAuditedTitle.roomId)?.customTitle ||
            roomToEditAuditedTitle.titleBilingual?.[locale] ||
            roomToEditAuditedTitle.title
          }
          originalRoomTitle={
            roomToEditAuditedTitle.titleBilingual?.[locale] || roomToEditAuditedTitle.title
          }
          onSave={handleSaveAuditedTitle}
          locale={locale}
        />
      )}
    </div>
  );
}
