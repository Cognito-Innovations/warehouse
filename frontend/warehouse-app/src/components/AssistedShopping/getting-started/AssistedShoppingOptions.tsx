"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CopyButtonAdvanced } from "@/components/UI";
import { 
  ASSISTED_SHOPPING_PRODUCT_LINK_KEY,
} from "@/utils/constants";
import { getCourierCompanies } from "@/lib/api.service";

interface AssistedShoppingOptionsProps {
  onLinkSubmit?: () => void;
}

interface CourierCompany {
  id: string;
  name: string;
  address: string;
  phone_number?: string;
  email?: string;
  country_id: string;
  country_name: string;
  country_code: string;
  is_active?: boolean;
}

export const AssistedShoppingOptions = ({ 
  onLinkSubmit
}: AssistedShoppingOptionsProps) => {
  const router = useRouter();
  const { status } = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [link, setLink] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);
  const [courierCompanies, setCourierCompanies] = useState<CourierCompany[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && status === "authenticated") {
      const storedLink = sessionStorage.getItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      if (storedLink) {
        setLink(storedLink);
        setActiveTab(0); // Switch to product link tab
        onLinkSubmit?.();
      }
    }
  }, [status]);

  useEffect(() => {
    const fetchCourierCompanies = async () => {
      try {
        setIsLoadingCouriers(true);
        const couriers = await getCourierCompanies();
        const activeCouriers = couriers.filter((c: CourierCompany) => c.is_active !== false);
        setCourierCompanies(activeCouriers);
        if (activeCouriers.length > 0) {
          setSelectedCourier(activeCouriers[0].id);
        }
      } catch (error) {
        console.error("Error fetching courier companies:", error);
      } finally {
        setIsLoadingCouriers(false);
      }
    };

    fetchCourierCompanies();
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLinkSubmit = () => {
    if (status === "loading") return;

    const trimmedLink = link.trim();
    if (!trimmedLink || !isValidUrl(trimmedLink)) {
      setError(true);
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY, trimmedLink);
    }

    if (status === "authenticated") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLinkSubmit?.();
      }, 100);
    } else {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && link.trim() && status !== "loading") {
      handleLinkSubmit();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "700px", md: "800px" },
        mx: "auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        width: "100%",
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: { xs: 2, md: 3 },
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            py: { xs: 1, sm: 1.25, md: 1.5 },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "50px",
              height: "100%",
              background: "linear-gradient(to right, #f9fafb, transparent)",
              zIndex: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "50px",
              height: "100%",
              background: "linear-gradient(to left, #f9fafb, transparent)",
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "max-content",
              animation: "marqueeScroll 25s linear infinite",
              "@keyframes marqueeScroll": {
                "0%": {
                  transform: "translateX(0)",
                },
                "100%": {
                  transform: "translateX(-50%)",
                },
              },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* Duplicate content for seamless loop */}
            {[...Array(2)].map((_, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                  color: "text.secondary",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                  px: { xs: 2, sm: 3, md: 4 },
                  display: "inline-flex",
                  alignItems: "center",
                  gap: { xs: 0.75, sm: 1, md: 1.5 },
                  flexShrink: 0,
                }}
              >
                <Box component="span" sx={{ color: "primary.main", fontWeight: 500 }}>
                  Supported categories:
                </Box>
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Medicines
                </Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Grocery</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Garments</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Jewellery</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Cosmetics</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Automobile</Box>
                <Box component="span" sx={{ color: "text.secondary" }}>•</Box>
                <Box component="span">Gadgets (Non-Battery)</Box>
                <Box component="span" sx={{ mx: { xs: 0.5, md: 1 }, color: "text.secondary" }}>|</Box>
                <Box component="span">Ship From Origin</Box>
                <Box component="span" sx={{ mx: { xs: 0.5, md: 1 }, color: "text.secondary" }}>|</Box>
                <Box component="span" sx={{ color: "text.secondary", fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  T&C Apply
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setError(false);
            }}
            sx={{
              minHeight: { xs: 56, sm: 52, md: 56 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.9375rem" },
                minHeight: { xs: 56, sm: 52, md: 56 },
                px: { xs: 1, sm: 1.5, md: 3 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                "& .MuiTab-iconWrapper": {
                  marginBottom: { xs: 0.25, sm: 0 },
                  marginRight: { xs: 0, sm: 0.75 },
                },
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
              "& .MuiTabs-indicator": {
                height: { xs: 2, md: 3 },
              },
            }}
            variant="fullWidth"
            scrollButtons={false}
          >
            <Tab
              icon={
                <LinkIcon 
                  sx={{ 
                    fontSize: { xs: 18, sm: 20, md: 22 },
                  }} 
                />
              }
              iconPosition="top"
              label="Product Link"
            />
            <Tab
              icon={
                <LocationOnIcon 
                  sx={{ 
                    fontSize: { xs: 18, sm: 20, md: 22 },
                  }} 
                />
              }
              iconPosition="top"
              label="Virtual Address"
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 4 }, "&:last-child": { pb: { xs: 2, sm: 2.5, md: 4 } } }}>
          {activeTab === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 0.75, md: 1 },
                    fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  Paste Product Link
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                    lineHeight: { xs: 1.4, md: 1.5 },
                  }}
                >
                  Paste a product link from any store and we'll help you purchase it
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Paste product link (e.g., https://amazon.com/...)"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    if (error) setError(false);
                  }}
                  onKeyPress={handleKeyPress}
                  error={error}
                  helperText={
                    error ? "Please enter a valid URL" : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon 
                          sx={{ fontSize: { xs: 18, md: 20 } }} 
                          color="action" 
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "#f9fafb",
                      borderRadius: 1,
                      fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                      py: { xs: 0.5, md: 0 },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: { xs: "0.75rem", md: "0.8125rem" },
                      mx: 0,
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: { xs: 0.5, md: 1 } }} />

              <Button
                variant="contained"
                onClick={handleLinkSubmit}
                disabled={!link.trim() || isLoading || status === "loading"}
                fullWidth
                sx={{
                  bgcolor: "#fccb00",
                  color: "#000",
                  fontWeight: "bold",
                  py: { xs: 1.25, sm: 1.5, md: 1.75 },
                  px: { xs: 2, md: 3 },
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#e3b600",
                    boxShadow: "0 4px 12px rgba(252, 203, 0, 0.3)",
                  },
                  "&:disabled": { bgcolor: "#fcefa8", color: "#888" },
                  fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                  textTransform: "none",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Search"
                )}
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 0.75, md: 1 },
                    fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  Virtual Addresses
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                    lineHeight: { xs: 1.4, md: 1.5 },
                  }}
                >
                  View available virtual addresses where you can have your packages delivered
                </Typography>

                {isLoadingCouriers ? (
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: { xs: 1.5, md: 2 }, 
                      py: { xs: 1.5, md: 2 },
                      flexWrap: "wrap",
                    }}
                  >
                    <CircularProgress size={20} sx={{ flexShrink: 0 }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}
                    >
                      Loading virtual addresses...
                    </Typography>
                  </Box>
                ) : (
                  <FormControl fullWidth>
                    <Select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      displayEmpty
                      sx={{
                        bgcolor: "#f9fafb",
                        borderRadius: { xs: 1, md: 1 },
                        fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e5e7eb",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                        "& .MuiSelect-select": {
                          py: { xs: 1.25, md: 1.5 },
                          minHeight: { xs: "auto", md: "auto" },
                        },
                      }}
                    >
                      {courierCompanies.length === 0 ? (
                        <MenuItem disabled value="">
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
                          >
                            No virtual addresses available
                          </Typography>
                        </MenuItem>
                      ) : (
                        courierCompanies.map((courier) => (
                          <MenuItem 
                            key={courier.id} 
                            value={courier.id}
                            sx={{ py: { xs: 1, md: 1.25 } }}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, md: 1 } }}>
                                <LocationOnIcon 
                                  sx={{ 
                                    fontSize: { xs: 16, md: 18 }, 
                                    color: "primary.main",
                                    flexShrink: 0,
                                  }} 
                                />
                                <Typography 
                                  variant="body1"
                                  sx={{ 
                                    fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                    fontWeight: 500,
                                  }}
                                >
                                  {courier.name} - {courier.country_name} ({courier.country_code})
                                </Typography>
                              </Box>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                                  color: "text.secondary",
                                  pl: { xs: 3.5, md: 4 },
                                  wordBreak: "break-word",
                                }}
                              >
                                {courier.address}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                )}

                {/* Selected Address Details */}
                {selectedCourier && !isLoadingCouriers && courierCompanies.length > 0 && (
                  <Box
                    sx={{
                      mt: { xs: 2.5, md: 3 },
                      p: { xs: 2, sm: 2.5, md: 3 },
                      bgcolor: "#f9fafb",
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: { xs: 2, md: 2.5 },
                        fontSize: { xs: "0.875rem", md: "0.9375rem" },
                        color: "text.primary",
                      }}
                    >
                      Selected Virtual Address Details
                    </Typography>

                    {(() => {
                      const selectedCourierData = courierCompanies.find(
                        (c) => c.id === selectedCourier
                      );
                      if (!selectedCourierData) return null;

                      return (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: { xs: 1.5, md: 2 },
                          }}
                        >
                          {/* Courier Name */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                  color: "text.secondary",
                                  mb: 0.5,
                                  fontWeight: 500,
                                }}
                              >
                                Courier Name
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                  color: "text.primary",
                                  wordBreak: "break-word",
                                }}
                              >
                                {selectedCourierData.name}
                              </Typography>
                            </Box>
                            <Box sx={{ flexShrink: 0 }}>
                              <CopyButtonAdvanced
                                text={selectedCourierData.name}
                                size="sm"
                                variant="minimal"
                                showTooltip={true}
                              />
                            </Box>
                          </Box>

                          {/* Address */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                  color: "text.secondary",
                                  mb: 0.5,
                                  fontWeight: 500,
                                }}
                              >
                                Address
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                  color: "text.primary",
                                  wordBreak: "break-word",
                                }}
                              >
                                {selectedCourierData.address}
                              </Typography>
                            </Box>
                            <Box sx={{ flexShrink: 0 }}>
                              <CopyButtonAdvanced
                                text={selectedCourierData.address}
                                size="sm"
                                variant="minimal"
                                showTooltip={true}
                              />
                            </Box>
                          </Box>

                          {/* Country */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                  color: "text.secondary",
                                  mb: 0.5,
                                  fontWeight: 500,
                                }}
                              >
                                Country
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                  color: "text.primary",
                                }}
                              >
                                {selectedCourierData.country_name} ({selectedCourierData.country_code})
                              </Typography>
                            </Box>
                            <Box sx={{ flexShrink: 0 }}>
                              <CopyButtonAdvanced
                                text={`${selectedCourierData.country_name} (${selectedCourierData.country_code})`}
                                size="sm"
                                variant="minimal"
                                showTooltip={true}
                              />
                            </Box>
                          </Box>

                          {/* Phone Number */}
                          {selectedCourierData.phone_number && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                    color: "text.secondary",
                                    mb: 0.5,
                                    fontWeight: 500,
                                  }}
                                >
                                  Phone Number
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                    color: "text.primary",
                                  }}
                                >
                                  {selectedCourierData.phone_number}
                                </Typography>
                              </Box>
                              <Box sx={{ flexShrink: 0 }}>
                                <CopyButtonAdvanced
                                  text={selectedCourierData.phone_number}
                                  size="sm"
                                  variant="minimal"
                                  showTooltip={true}
                                />
                              </Box>
                            </Box>
                          )}

                          {/* Email */}
                          {selectedCourierData.email && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                    color: "text.secondary",
                                    mb: 0.5,
                                    fontWeight: 500,
                                  }}
                                >
                                  Email
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                                    color: "text.primary",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {selectedCourierData.email}
                                </Typography>
                              </Box>
                              <Box sx={{ flexShrink: 0 }}>
                                <CopyButtonAdvanced
                                  text={selectedCourierData.email}
                                  size="sm"
                                  variant="minimal"
                                  showTooltip={true}
                                />
                              </Box>
                            </Box>
                          )}

                          {/* Full Address Copy */}
                          <Box
                            sx={{
                              mt: { xs: 1, md: 1.5 },
                              pt: { xs: 1.5, md: 2 },
                              borderTop: "1px solid #e5e7eb",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                                    color: "text.secondary",
                                    mb: 0.5,
                                    fontWeight: 500,
                                  }}
                                >
                                  Copy Full Address
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                                    color: "text.secondary",
                                  }}
                                >
                                  Copy all address details at once
                                </Typography>
                              </Box>
                              <Box sx={{ flexShrink: 0 }}>
                                <CopyButtonAdvanced
                                  text={`${selectedCourierData.name}\n${selectedCourierData.address}\n${selectedCourierData.country_name} (${selectedCourierData.country_code})${selectedCourierData.phone_number ? `\nPhone: ${selectedCourierData.phone_number}` : ''}${selectedCourierData.email ? `\nEmail: ${selectedCourierData.email}` : ''}`}
                                  size="sm"
                                  variant="default"
                                  showTooltip={true}
                                  showText={true}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
