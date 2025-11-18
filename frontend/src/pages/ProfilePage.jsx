import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header"; // Cambio a alias @
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Cambio a alias @
import { Button } from "@/components/ui/button"; // Cambio a alias @
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Cambio a alias @
import { Badge } from "@/components/ui/badge"; // Cambio a alias @
import { Input } from "@/components/ui/input"; // Cambio a alias @
import { Label } from "@/components/ui/label"; // Cambio a alias @
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Cambio a alias @
import { Camera, Award, Heart, Droplet, LogOut, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Cambio a alias @
import { useAuth } from "@/context/AuthContext"; // Cambio a alias @
import profileDefault from "@/assets/perfildefault.png";
export default function ProfilePage() {
  // 1. Obtenemos los datos y funciones del contexto
  const { user, handleLogout, handleUpdateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  // Guardamos una referencia segura al usuario (por si acaso es null momentáneamente)
  const currentUser = user || {};

  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState(currentUser.profileImage || null);
  // Estado que controla si el formulario está en modo edición
  const [isEditing, setIsEditing] = useState(false);

  // Estado del formulario con los datos editables del usuario
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    bloodType: currentUser.bloodType || "",
    weight: currentUser.weight || "",
  });

  // Efecto para actualizar el formulario si el usuario del contexto cambia
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bloodType: user.bloodType || "",
        weight: user.weight || "",
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  /**
   * handleImageUpload - Maneja la carga de la foto de perfil
   */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);

        // Actualizar usuario en el contexto
        const updatedUser = { profileImage: imageUrl };
        handleUpdateUser(updatedUser);

        // Simulación de persistencia local (opcional si tienes backend para esto)
        const storedUser = JSON.parse(localStorage.getItem("hemoapp_user") || "{}");
        localStorage.setItem("hemoapp_user", JSON.stringify({ ...storedUser, ...updatedUser }));

        toast({
          title: "Foto actualizada",
          description: "Tu foto de perfil se ha actualizado correctamente",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    const updatedData = { ...formData };

    // Actualizar usuario en el contexto
    handleUpdateUser(updatedData);

    // Simulación de persistencia local
    const storedUser = JSON.parse(localStorage.getItem("hemoapp_user") || "{}");
    localStorage.setItem("hemoapp_user", JSON.stringify({ ...storedUser, ...updatedData }));

    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus datos se han actualizado correctamente",
    });
  };

  const getInitials = () => {
    return `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase();
  };

  const badges = [
    { id: 1, name: "Primera Donación", icon: Heart, color: "bg-accent" },
    { id: 2, name: "5 Donaciones", icon: Droplet, color: "bg-primary" },
    { id: 3, name: "Donante Regular", icon: Award, color: "bg-yellow-500" },
  ];

  // Datos de donaciones
  const userDonations = currentUser.donations || [];
  const donationCount = userDonations.length || currentUser.donationCount || 0;
  const lastDonationDate = userDonations.length > 0 ? userDonations[userDonations.length - 1].date : currentUser.lastDonation;
  const livesSaved = donationCount * 3;

  const [donationForm, setDonationForm] = useState({
    date: "",
    hospital: "",
    units: 1,
    bloodType: currentUser.bloodType || "",
  });

  const addDonation = () => {
    if (!donationForm.date || !donationForm.hospital) {
      toast({
        title: "Faltan datos",
        description: "Completa fecha y hospital",
        variant: "destructive",
      });
      return;
    }

    // Crear nueva lista de donaciones
    const newDonations = [...(currentUser.donations || []), donationForm];
    const updatedData = {
      donations: newDonations,
      donationCount: newDonations.length,
      lastDonation: donationForm.date,
    };

    // Actualizar contexto
    handleUpdateUser(updatedData);

    // Actualizar localStorage
    const storedUser = JSON.parse(localStorage.getItem("hemoapp_user") || "{}");
    localStorage.setItem("hemoapp_user", JSON.stringify({ ...storedUser, ...updatedData }));

    setDonationForm({
      date: "",
      hospital: "",
      units: 1,
      bloodType: currentUser.bloodType || "",
    });

    toast({
      title: "Donación registrada",
      description: "Se agregó la donación al historial",
    });
  };

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>{/* Título opcional para la tarjeta */}</CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={profileImage || profileDefault} className="scale-150" />
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-accent-foreground" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                <div className="flex-1 text-center md:text-left w-full">
                  {!isEditing ? (
                    <>
                      <h1 className="text-3xl font-bold text-primary mb-2">
                        {currentUser.firstName} {currentUser.lastName}
                      </h1>
                      <p className="text-muted-foreground mb-4">{currentUser.email}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                          <Droplet className="w-3 h-3 mr-1" />
                          {currentUser.bloodType || "N/A"}
                        </Badge>
                        <Badge variant="outline">{currentUser.weight ? `${currentUser.weight} kg` : "Peso N/A"}</Badge>
                      </div>
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="mt-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4 w-full max-w-md mx-auto md:mx-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">Tipo de Sangre</Label>
                          <Select value={formData.bloodType} onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Peso (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateProfile} className="flex-1">
                          Guardar Cambios
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Donaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{donationCount}</p>
                <p className="text-sm text-muted-foreground">veces</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Última donación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">{lastDonationDate || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{lastDonationDate ? "registrada" : "sin registros"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vidas salvadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-accent">{livesSaved}</p>
                <p className="text-sm text-muted-foreground">personas</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges/Reconocimientos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Reconocimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                    <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mb-2`}>
                      <badge.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-center">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation history & add donation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-accent" />
                Historial de Donaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userDonations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aún no registraste donaciones. Agrega la más reciente aquí.</p>
                ) : (
                  userDonations.map((d, i) => (
                    <div key={i} className="p-3 border rounded">
                      <div className="font-medium">
                        {d.date} — {d.hospital}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {d.units} unidades • {d.bloodType}
                      </div>
                    </div>
                  ))
                )}

                <div className="pt-4 border-t mt-4">
                  <h4 className="font-semibold mb-3 text-primary">Registrar nueva donación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <Input
                      type="date"
                      value={donationForm.date}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          date: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Hospital"
                      value={donationForm.hospital}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          hospital: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      min={1}
                      placeholder="Unidades"
                      value={donationForm.units}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          units: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <Select value={donationForm.bloodType} onValueChange={(v) => setDonationForm({ ...donationForm, bloodType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de sangre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addDonation} className="w-full bg-primary hover:bg-primary/90">
                      Registrar donación
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={onLogoutClick} variant="destructive" className="w-full" size="lg">
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
