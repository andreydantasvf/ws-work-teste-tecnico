import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

/**
 * 404 Not Found page component
 * Displays when user tries to access a non-existent route
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-large animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-destructive bg-clip-text text-transparent mb-2">
              404
            </CardTitle>
            <CardTitle className="text-xl font-semibold text-card-foreground mb-2">
              Página não encontrada
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center">
              A página que você está procurando não existe ou foi movida para
              outro local.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Verifique se a URL está correta ou retorne ao dashboard para
                continuar navegando.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoHome}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-soft"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full border border-border/50 hover:border-primary/50 bg-transparent hover:bg-muted/50"
              >
                Página Anterior
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional info section */}
        <div
          className="mt-8 text-center animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">WS - AutoManager</strong> -
              Sistema de Gestão Automotiva
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Gerencie marcas, modelos e carros de forma eficiente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
