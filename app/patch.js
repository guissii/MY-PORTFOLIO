const fs = require('fs');

const file = 'src/pages/AdminPhotosPage.tsx';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
const returnIndex = lines.findIndex(l => l.trim() === 'return (' && lines[lines.indexOf(l)+1].includes('<section'));

if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const topHalf = lines.slice(0, returnIndex).join('\n');

const newImports = `
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
`;

let modifiedTopHalf = topHalf;
if (!topHalf.includes('import { Card')) {
    const importLines = topHalf.split('\n');
    importLines.splice(4, 0, newImports);
    modifiedTopHalf = importLines.join('\n');
}

const newJSX = `
  const renderLogin = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md bg-[#0D0B1E] border-[rgba(201,162,39,0.25)] text-[#F0E6FF]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Espace Admin</CardTitle>
          <CardDescription className="text-[#BEBAD0]">Connexion requise pour accéder au panneau d'administration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Identifiant</Label>
            <Input id="username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Identifiant" className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" autoComplete="username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="***" className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" autoComplete="current-password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={signIn} disabled={loading} className="w-full bg-[#C9A227] text-[#0D0B1E] hover:bg-[#b08d22] transition-colors">{loading ? 'Connexion...' : 'Se connecter'}</Button>
          {status && <p className="text-sm text-[#D2CDDE] text-center">{status}</p>}
        </CardFooter>
      </Card>
    </div>
  );

  const renderStats = () => {
    const data = (Object.entries(analytics?.byCountry ?? {}) as Array<[string, number]>)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([country, views]) => ({ country, views }));

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#F0E6FF]">Statistiques Globales</h2>
            <p className="text-sm text-[#BEBAD0]">Dernière mise à jour : {analytics?.updatedAt ? new Date(analytics.updatedAt).toLocaleString() : '—'}</p>
          </div>
          <Button onClick={loadAnalytics} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Rafraîchir</Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227] rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[#BEBAD0] text-sm font-medium">Vues Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F0E6FF]">{analytics?.total ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)]">
          <CardHeader>
            <CardTitle className="text-[#F0E6FF]">Vues par pays</CardTitle>
            <CardDescription className="text-[#BEBAD0]">
              Répartition géographique des visiteurs de votre portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="country" stroke="#BEBAD0" tick={{fill: '#BEBAD0'}} angle={-45} textAnchor="end" />
                    <YAxis stroke="#BEBAD0" tick={{fill: '#BEBAD0'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#17142A', borderColor: 'rgba(255,255,255,0.12)', color: '#F0E6FF', borderRadius: '8px' }}
                      itemStyle={{ color: '#C9A227', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="views" name="Vues" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={entry.country === 'MA' ? '#10b981' : entry.country === 'FR' ? '#3b82f6' : '#C9A227'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-[#BEBAD0] border-t border-[rgba(255,255,255,0.05)] mt-4">Aucune donnée pour le moment.</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjectForm = () => {
    if (!draft) return null;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#17142A] p-4 rounded-xl border border-[rgba(255,255,255,0.12)]">
          <div>
            <h3 className="text-lg font-semibold text-[#C9A227]">Édition: {draft.title}</h3>
            <span className="text-xs text-[#BEBAD0] font-mono">slug: {draft.slug}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={applyDraft} disabled={loading} className="bg-[#C9A227] text-[#0D0B1E] hover:bg-[#b08d22]">Appliquer modifs</Button>
            <Button onClick={saveProjects} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Sauvegarder</Button>
            <Button onClick={deleteProject} disabled={loading} variant="destructive" className="bg-red-900/80 hover:bg-red-900 text-red-100">Sup.</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)] lg:col-span-2 shadow-none">
            <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#F0E6FF] text-base">Informations Générales</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Titre</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
                <div className="space-y-2"><Label>Sous-titre / Rôle</Label><Input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
                <div className="space-y-2"><Label>Date réalisation</Label><Input value={draft.realizationDate} onChange={(e) => setDraft({ ...draft, realizationDate: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
              </div>
              <div className="space-y-2">
                <Label>Description Complète</Label>
                <Textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF] min-h-[160px] font-sans resize-y" />
              </div>
              <div className="space-y-2">
                <Label>Tags (séparés par virgule)</Label>
                <Input value={draft.tags.join(', ')} onChange={(e) => setDraft({ ...draft, tags: splitComma(e.target.value) })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF] font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)] shadow-none">
            <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#F0E6FF] text-base">Liens & Médias</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Lien GitHub</Label><Input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
              <div className="space-y-2"><Label>Lien Démo</Label><Input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
              <div className="space-y-2">
                <Label>Image de couverture (fallback)</Label>
                <Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" placeholder="/images/projects/..." />
              </div>
              <div className="flex items-center space-x-2 pt-4 bg-[#17142A] p-3 rounded-md border border-[rgba(255,255,255,0.05)]">
                <Checkbox id="hidden-proj" checked={Boolean(draft.hidden)} onCheckedChange={(checked) => setDraft({ ...draft, hidden: Boolean(checked) })} className="border-[rgba(255,255,255,0.3)] data-[state=checked]:bg-[#C9A227] data-[state=checked]:text-[#0D0B1E]" />
                <label htmlFor="hidden-proj" className="text-sm font-medium leading-none text-[#F0E6FF] cursor-pointer">Masquer sur l'accueil</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPhotos = (collectionInfo: { type: 'projects'|'hackathons', slug: string, currentCover: string | undefined }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-[#17142A] border-[rgba(255,255,255,0.12)]">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="space-y-1">
            <CardTitle className="text-base text-[#F0E6FF]">Galerie Photos</CardTitle>
            <CardDescription className="text-[#BEBAD0] font-mono text-xs">Path: {collectionInfo.type}/{collectionInfo.slug}/</CardDescription>
          </div>
          <Button onClick={loadImages} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Rafraîchir images</Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[rgba(255,255,255,0.02)] p-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
            <Input key={fileInputKey} type="file" accept="image/*" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)] text-[#F0E6FF] cursor-pointer file:text-[#C9A227]" />
            <Button onClick={uploadImage} disabled={loading || selectedFiles.length === 0} className="w-full sm:w-auto bg-[#C9A227] text-[#0D0B1E] hover:bg-[#b08d22] whitespace-nowrap">Uploader ({selectedFiles.length})</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => {
          const isCover = Boolean(collectionInfo.currentCover) && collectionInfo.currentCover === img.pathname;
          return (
            <Card key={img.url} className={\`bg-[#17142A] border \${isCover ? 'border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.2)]' : 'border-[rgba(255,255,255,0.12)]'} overflow-hidden flex flex-col\`}>
              <div className="relative aspect-video w-full bg-black/60 group overflow-hidden">
                <img src={img.url} alt={img.pathname} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                {isCover && <div className="absolute top-2 right-2 bg-[#C9A227] text-[#0D0B1E] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider backdrop-blur-sm">Couverture</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17142A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-3 pb-2 flex-grow">
                <p className="text-[#E0DCEB] text-xs font-mono truncate mb-1" title={img.pathname}>{img.pathname.split('/').pop()}</p>
                <p className="text-[#888] font-mono text-[10px]">{(img.size / 1024).toFixed(0)} KB • {new Date(img.uploadedAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex flex-nowrap gap-2 mt-auto">
                <Button onClick={() => setCoverImage(img.pathname)} disabled={loading || isCover} variant={isCover ? 'secondary' : 'outline'} size="sm" className={\`text-xs flex-1 h-8 px-2 \${isCover ? 'bg-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/30' : 'border-[rgba(255,255,255,0.1)] hover:bg-white/5 text-[#BEBAD0]'}\`}>{isCover ? 'Actuelle' : 'Cover'}</Button>
                <Button onClick={() => deleteImage(img.url)} disabled={loading} variant="destructive" size="sm" className="bg-red-900/50 hover:bg-red-900 text-red-200 text-xs h-8 px-3 border border-red-900/50">Del</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen pb-20 pt-16 px-4 md:px-8 text-[#F0E6FF] selection:bg-[#C9A227] selection:text-[#0D0B1E]">
      <div className="mx-auto max-w-6xl">
        <Button variant="outline" onClick={() => window.location.hash = '/'} className="mb-6 border-[rgba(201,162,39,0.3)] text-[#C9A227] bg-[#C9A227]/5 font-mono text-xs hover:bg-[#C9A227]/20 hover:text-[#C9A227] transition-all"><span className="mr-2">←</span> RETOUR AU SITE</Button>

        {!auth ? renderLogin() : (
          <div className="space-y-8 fade-in animate-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-6 gap-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#BEBAD0]">Administration</h1>
                <p className="text-[#8f8ba8] max-w-2xl text-sm leading-relaxed">Gérez le contenu de votre portfolio, uploadez des photos via Vercel Blob et suivez vos statistiques de trafic en temps réel.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#17142A] p-1.5 pr-4 rounded-full border border-[rgba(255,255,255,0.08)] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227] to-[#8f7112] flex items-center justify-center text-[#0D0B1E] font-bold text-sm shadow-inner uppercase">{auth.username.charAt(0)}</div>
                <div className="text-sm font-medium text-[#E0DCEB]">{auth.username}</div>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button onClick={signOut} className="text-[11px] text-[#BEBAD0] hover:text-[#C9A227] uppercase tracking-wider font-semibold transition-colors">Déco</button>
              </div>
            </div>

            <Tabs value={mode} onValueChange={(val) => { setMode(val as any); setPanel('content'); setImages([]); setStatus(''); if (val === 'stats') loadAnalytics(); }} className="w-full">
              <TabsList className="bg-[#17142A] border border-[rgba(255,255,255,0.08)] p-1 rounded-xl mb-6 shadow-sm overflow-x-auto flex-nowrap hide-scrollbar max-w-full justify-start md:justify-center">
                <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-[#C9A227] data-[state=active]:text-[#0D0B1E] px-4 md:px-8 py-2 md:py-2.5 transition-all text-sm font-medium">Projets</TabsTrigger>
                <TabsTrigger value="hackathons" className="rounded-lg data-[state=active]:bg-[#C9A227] data-[state=active]:text-[#0D0B1E] px-4 md:px-8 py-2 md:py-2.5 transition-all text-sm font-medium">Hackathons</TabsTrigger>
                <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-[#C9A227] data-[state=active]:text-[#0D0B1E] px-4 md:px-8 py-2 md:py-2.5 transition-all text-sm font-medium">Statistiques</TabsTrigger>
              </TabsList>

              <div className="bg-[#17142A]/50 border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-3 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-[#8f8ba8] gap-2 backdrop-blur-sm">
                <span>Status: <strong className={status ? "font-mono text-yellow-500 font-medium ml-1" : "font-mono text-green-500/80 font-medium ml-1"}>{status || 'Prêt pour modifications'}</strong></span>
                {loading && <span className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-md text-[#BEBAD0] border border-white/5"><span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse"></span> Traitement...</span>}
              </div>

              <TabsContent value="stats" className="mt-0 outline-none">
                {renderStats()}
              </TabsContent>

              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="w-full lg:w-[28%] xl:w-1/4 space-y-6 flex-shrink-0">
                    <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.08)] shadow-lg">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#F0E6FF] text-sm font-semibold tracking-wide uppercase">Sélecteur de Projet</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <Input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Chercher via tag ou titre..." className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm h-9 placeholder:text-[#888]" />
                        <div className="space-y-0.5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {slugOptions.map((item) => (
                            <button key={item.slug} onClick={() => setSelectedSlug(item.slug)} className={\`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all flex items-center justify-between group \${selectedSlug === item.slug ? 'bg-[rgba(201,162,39,0.15)] text-[#C9A227] border border-[rgba(201,162,39,0.3)]' : 'text-[#BEBAD0] hover:bg-white/5 border border-transparent'}\`}>
                              <span className="truncate pr-2 font-medium">{item.title}</span> 
                              {item.hidden && <span className={\`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded \${selectedSlug === item.slug ? 'bg-[#C9A227]/20 text-[#C9A227]' : 'bg-white/10 text-[#888]'}\`}>Caché</span>}
                            </button>
                          ))}
                        </div>
                        <Button onClick={loadProjects} disabled={loading} variant="outline" className="w-full border-[rgba(255,255,255,0.1)] text-[#BEBAD0] hover:bg-white/5 hover:text-white mt-2 h-9 text-xs">Recharger de la base</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.08)] shadow-lg">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#F0E6FF] text-sm font-semibold tracking-wide uppercase">Créer un Nouveau</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Identifiant (slug)</Label>
                          <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="mon-super-projet" className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm font-mono h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Titre du projet</Label>
                          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre d'affichage" className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm h-9" />
                        </div>
                        <Button onClick={createProject} disabled={loading || !newSlug || !newTitle} className="w-full bg-[#E0DCEB] text-[#0D0B1E] hover:bg-white transition-colors h-9">Ajouter l'entrée</Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-full lg:w-[72%] xl:w-3/4">
                    {selectedProject && (
                      <Tabs value={panel} onValueChange={(v) => { setPanel(v as any); if(v==='photos') loadImages(); }} className="w-full">
                        <TabsList className="bg-[#17142A] border border-[rgba(255,255,255,0.08)] w-full justify-start rounded-b-none border-b-0 pb-0 pt-2 px-2 h-auto flex gap-1 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.3)]">
                          <TabsTrigger value="content" className="data-[state=active]:bg-[#0D0B1E] data-[state=active]:border-[rgba(255,255,255,0.12)] data-[state=active]:border-b-[#0D0B1E] data-[state=active]:text-[#F0E6FF] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none">Données & Textes</TabsTrigger>
                          <TabsTrigger value="photos" className="data-[state=active]:bg-[#0D0B1E] data-[state=active]:border-[rgba(255,255,255,0.12)] data-[state=active]:border-b-[#0D0B1E] data-[state=active]:text-[#F0E6FF] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none flex items-center gap-2">
                             Galerie <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded leading-none text-[#BEBAD0]">Blob</span>
                          </TabsTrigger>
                        </TabsList>
                        <div className="bg-[#0D0B1E] border border-[rgba(255,255,255,0.12)] rounded-lg rounded-tl-none p-5 sm:p-7 min-h-[500px] shadow-xl relative z-10 -mt-[1px]">
                          <TabsContent value="content" className="mt-0 outline-none">{renderProjectForm()}</TabsContent>
                          <TabsContent value="photos" className="mt-0 outline-none">{renderPhotos({ type: 'projects', slug: selectedSlug, currentCover: selectedProject.coverImagePathname })}</TabsContent>
                        </div>
                      </Tabs>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hackathons" className="mt-0 outline-none">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="w-full lg:w-[28%] xl:w-1/4 space-y-6 flex-shrink-0">
                    <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.08)] shadow-lg">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#F0E6FF] text-sm font-semibold tracking-wide uppercase">Sélecteur Hackathon</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <Input value={hackathonSearch} onChange={(e) => setHackathonSearch(e.target.value)} placeholder="Chercher via nom..." className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm h-9 placeholder:text-[#888]" />
                        <div className="space-y-0.5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {hackathonOptions.map((item) => (
                            <button key={item.slug} onClick={() => setSelectedHackathonSlug(item.slug)} className={\`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all flex items-center justify-between \${selectedHackathonSlug === item.slug ? 'bg-[rgba(201,162,39,0.15)] text-[#C9A227] border border-[rgba(201,162,39,0.3)] font-medium' : 'text-[#BEBAD0] hover:bg-white/5 border border-transparent'}\`}>
                              <span className="truncate">{item.name}</span>
                            </button>
                          ))}
                        </div>
                        <Button onClick={loadHackathons} disabled={loading} variant="outline" className="w-full border-[rgba(255,255,255,0.1)] text-[#BEBAD0] hover:bg-white/5 hover:text-white mt-2 h-9 text-xs">Recharger de la base</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.08)] shadow-lg">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#F0E6FF] text-sm font-semibold tracking-wide uppercase">Créer un Nouveau</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Identifiant (slug)</Label>
                          <Input value={newHackathonSlug} onChange={(e) => setNewHackathonSlug(e.target.value)} placeholder="inno-hack-2026" className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm font-mono h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Nom complet</Label>
                          <Input value={newHackathonName} onChange={(e) => setNewHackathonName(e.target.value)} placeholder="Inno Hackathon" className="bg-[#17142A] border-[rgba(255,255,255,0.1)] text-[#F0E6FF] text-sm h-9" />
                        </div>
                        <Button onClick={createHackathon} disabled={loading || !newHackathonSlug || !newHackathonName} className="w-full bg-[#E0DCEB] text-[#0D0B1E] hover:bg-white transition-colors h-9">Ajouter l'entrée</Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-full lg:w-[72%] xl:w-3/4">
                    {selectedHackathon && hackathonDraft && (
                      <Tabs value={panel} onValueChange={(v) => { setPanel(v as any); if(v==='photos') loadImages(); }} className="w-full">
                        <TabsList className="bg-[#17142A] border border-[rgba(255,255,255,0.08)] w-full justify-start rounded-b-none border-b-0 pb-0 pt-2 px-2 h-auto flex gap-1 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.3)]">
                          <TabsTrigger value="content" className="data-[state=active]:bg-[#0D0B1E] data-[state=active]:border-[rgba(255,255,255,0.12)] data-[state=active]:border-b-[#0D0B1E] data-[state=active]:text-[#F0E6FF] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none">Données Hackathon</TabsTrigger>
                          <TabsTrigger value="photos" className="data-[state=active]:bg-[#0D0B1E] data-[state=active]:border-[rgba(255,255,255,0.12)] data-[state=active]:border-b-[#0D0B1E] data-[state=active]:text-[#F0E6FF] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none flex items-center gap-2">
                             Galerie <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded leading-none text-[#BEBAD0]">Blob</span>
                          </TabsTrigger>
                        </TabsList>
                        <div className="bg-[#0D0B1E] border border-[rgba(255,255,255,0.12)] rounded-lg rounded-tl-none p-5 sm:p-7 min-h-[500px] shadow-xl relative z-10 -mt-[1px]">
                          <TabsContent value="content" className="mt-0 outline-none space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#17142A] p-4 rounded-xl border border-[rgba(255,255,255,0.12)]">
                              <div>
                                <h3 className="text-lg font-semibold text-[#C9A227]">Édition: {hackathonDraft.name}</h3>
                                <span className="text-xs text-[#BEBAD0] font-mono">slug: {hackathonDraft.slug}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Button onClick={applyHackathonDraft} disabled={loading} className="bg-[#C9A227] text-[#0D0B1E] hover:bg-[#b08d22]">Appliquer</Button>
                                <Button onClick={saveHackathons} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Sauvegarder</Button>
                                <Button onClick={deleteHackathon} disabled={loading} variant="destructive" className="bg-red-900/80 hover:bg-red-900 text-red-100">Sup.</Button>
                              </div>
                            </div>
                            
                            <Card className="bg-[#0D0B1E] border-[rgba(255,255,255,0.12)] shadow-none">
                              <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#F0E6FF] text-base">Informations</CardTitle></CardHeader>
                              <CardContent className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2"><Label>Nom global</Label><Input value={hackathonDraft.name} onChange={(e) => setHackathonDraft({ ...hackathonDraft, name: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
                                  <div className="space-y-2"><Label>Date / Période</Label><Input value={hackathonDraft.period} onChange={(e) => setHackathonDraft({ ...hackathonDraft, period: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF]" /></div>
                                  <div className="space-y-2 md:col-span-2"><Label>Résultat ou Place</Label><Input value={hackathonDraft.result} onChange={(e) => setHackathonDraft({ ...hackathonDraft, result: e.target.value })} className="bg-[rgba(201,162,39,0.05)] border-[rgba(201,162,39,0.3)] text-[#C9A227] font-medium" /></div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Bref résumé ou infos complémentaires</Label>
                                  <Textarea value={hackathonDraft.detail || ''} onChange={(e) => setHackathonDraft({ ...hackathonDraft, detail: e.target.value })} className="bg-[#17142A] border-[rgba(255,255,255,0.12)] text-[#F0E6FF] min-h-[160px] font-sans" />
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          <TabsContent value="photos" className="mt-0 outline-none">{renderPhotos({ type: 'hackathons', slug: selectedHackathonSlug, currentCover: selectedHackathon?.coverImagePathname })}</TabsContent>
                        </div>
                      </Tabs>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
}
`;

fs.writeFileSync(file, modifiedTopHalf + '\n' + newJSX);
console.log('AdminPhotosPage.tsx patched successfully.');
