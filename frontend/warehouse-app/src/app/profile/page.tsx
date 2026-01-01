"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Box, Container, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

import { getUser } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileDetailsView from "@/components/profile/ProfileDetailsView";
import CountrySelectionView from "@/components/profile/CountrySelectionView";
import CurrencySelectionView from "@/components/profile/CurrencySelectionView";
import EditProfileModal, { ProfileData } from "@/components/Modals/EditProfileModal";
import ProfileMobileMenu, { ProfileViewType } from "@/components/profile/ProfileMobileMenu";

function ProfileContent() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useAuth();

  // Profile Data State
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id_card_passport_no: "",
    name: "",
    email: "",
    phone_code: "",
    phone_number: "",
    alternate_phone_number: "",
    gender: "",
    dob: "",
    email_verified: false,
  });

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userInfo = await getUser(user.id);
      setProfileData({
        id_card_passport_no: userInfo.id_card_passport_no || "",
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone_code: userInfo.phone_code || "",
        phone_number: userInfo.phone_number || "",
        alternate_phone_number: userInfo.alternate_phone_number || "",
        gender: userInfo.gender || "",
        dob: userInfo.dob?.split("T")[0] || "",
        email_verified: userInfo.email_verified || false,
      });
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserProfile();
  }, [user?.id, fetchUserProfile]);

  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParam = searchParams.get("view") as ProfileViewType | null;

  // State to manage the active view
  const [activeView, setActiveView] = useState<ProfileViewType>(
    viewParam || (isDesktop ? "details" : "menu")
  );

  useEffect(() => {
    const targetView = viewParam || (isDesktop ? "details" : "menu");
    if (targetView !== activeView) {
      setActiveView(targetView);
    }
  }, [viewParam, activeView, isDesktop]);

  const handleNavigate = (view: ProfileViewType) => {
    if (!isDesktop && view === "details") {
      setEditModalOpen(true);
      return;
    }

    // Update URL when navigating
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`/profile?${params.toString()}`);

    setActiveView(view);
  };

  const handleBack = () => {
    const targetView = isDesktop ? "details" : "menu";
    // Update URL when going back
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", targetView);
    router.replace(`/profile?${params.toString()}`);

    setActiveView(targetView);
  };

  const renderContent = () => {
    switch (activeView) {
      case "details":
        return (
          <ProfileDetailsView
            onBack={handleBack}
            showBackButton={!isDesktop}
            profileData={profileData}
            loading={loading}
            onEdit={() => setEditModalOpen(true)}
          />
        );
      case "country":
        return <CountrySelectionView onBack={handleBack} showBackButton={false} />;
      case "currency":
        return <CurrencySelectionView onBack={handleBack} showBackButton={false} />;
      case "menu":
      default:
        return isDesktop ? (
          <ProfileDetailsView
            profileData={profileData}
            loading={loading}
            onEdit={() => setEditModalOpen(true)}
          />
        ) : (
          <ProfileMobileMenu onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isDesktop ? (
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 320, flexShrink: 0 }}>
            <ProfileSidebar
              activeView={activeView === "menu" ? "details" : activeView}
              onSelectView={handleNavigate}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      ) : (
        <Box>
          {renderContent()}
        </Box>
      )}

      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
        loading={loading}
      />
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <ProfileContent />
    </Suspense>
  );
}