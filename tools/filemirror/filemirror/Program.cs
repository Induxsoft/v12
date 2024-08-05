using System;
using System.IO;
using System.Collections.Generic;


namespace filemirror
{
    class DirWatcher
    {
        public DirWatcher(string source, string target)
        {
            this.watcher = new FileSystemWatcher(source);
            this.watcher.NotifyFilter = NotifyFilters.Attributes
                                 | NotifyFilters.CreationTime
                                 | NotifyFilters.DirectoryName
                                 | NotifyFilters.FileName
                                 | NotifyFilters.LastAccess
                                 | NotifyFilters.LastWrite
                                 | NotifyFilters.Security
                                 | NotifyFilters.Size;

            watcher.Changed += OnChanged;
            watcher.Created += OnCreated;
            watcher.Deleted += OnDeleted;
            watcher.Renamed += OnRenamed;
            watcher.Error += OnError;

            watcher.Filter = "*.*";
            watcher.IncludeSubdirectories = true;
            watcher.EnableRaisingEvents = true;

            this.source = source;
            this.target = target;

        }

        private void OnError(object sender, ErrorEventArgs e)
        {
            Console.WriteLine("Error: " + e.ToString());
        }

        private void OnRenamed(object sender, RenamedEventArgs e)
        {
            DoRename(e.OldFullPath, e.FullPath);
        }

        private void OnDeleted(object sender, FileSystemEventArgs e)
        {
            DoDelete(e.FullPath);
        }

        private void OnCreated(object sender, FileSystemEventArgs e)
        {
            if (File.Exists(e.FullPath))
            {
                DoFileReflex(e.FullPath);
            }
        }

        private string reflexTo(string file)
        {
            return Path.Combine(this.target, Path.GetFullPath(file).Replace(Path.GetFullPath(this.source), "").TrimStart('\\').TrimStart('/'));
        }

        private void DoFileReflex(string file)
        {
            string t = reflexTo(file);
            try
            {
                if (!Directory.Exists(Path.GetDirectoryName(t)))
                    Directory.CreateDirectory(Path.GetDirectoryName(t));

                File.Copy(file, t, true);

                Console.WriteLine("Actualizado: " + t);
            }
            catch(Exception e)
            {
                Console.WriteLine("Origen: " + file);
                Console.WriteLine("Destino:" + t);
                Console.WriteLine(e.Message);
            }
        }

        private void DoRename(string oldfile,string newfile)
        {
            string t = reflexTo(oldfile);
            string t2 = reflexTo(newfile);
            if (File.Exists(t))
            {
                try
                {
                    File.Move(t,t2);
                    Console.WriteLine("Renombrado: " + t);
                }
                catch (Exception e)
                {
                    Console.WriteLine("Origen (renombrado): " + oldfile);
                    Console.WriteLine("Destino:" + t);
                    Console.WriteLine(e.Message);
                }
            }
            else if (Directory.Exists(t))
            {
                try
                {
                    Directory.Move(t,t2);
                    Console.WriteLine("Directorio renombrado: " + t);
                }
                catch (Exception e)
                {
                    Console.WriteLine("Dir. Origen (renombrado): " + oldfile);
                    Console.WriteLine("Dir. Destino:" + t);
                    Console.WriteLine(e.Message);
                }
            }
            else { Console.WriteLine("No se encontró el archivo o directorio en el destino:" + t); }
        }

        private void DoDelete(string file)
        {
            string t = reflexTo(file);
            if (File.Exists(t))
            {
                try
                {
                    File.Delete(t);
                    Console.WriteLine("Eliminado: " + t);
                }
                catch (Exception e)
                {
                    Console.WriteLine("Origen (eliminado): " + file);
                    Console.WriteLine("Destino:" + t);
                    Console.WriteLine(e.Message);
                }
            }
            else if (Directory.Exists(t))
            {
                try
                {
                    Directory.Delete(t);
                    Console.WriteLine("Directorio eliminado: " + t);
                }
                catch (Exception e)
                {
                    Console.WriteLine("Dir. Origen (eliminado): " + file);
                    Console.WriteLine("Dir. Destino:" + t);
                    Console.WriteLine(e.Message);
                }
            }
            else { Console.WriteLine("No se encontró el archivo o directorio en el destino:" + t); }
        }

        private void OnChanged(object sender, FileSystemEventArgs e)
        {
            if (File.Exists(e.FullPath))
            {
                DoFileReflex(e.FullPath);
            }
        }

        public FileSystemWatcher watcher { get; set; }
        public string target { get; set; }
        public string source { get; set; }
    }
    class Program
    {
        static Dictionary<string, string> vars = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        static Dictionary<string, DirWatcher> dirs = new Dictionary<string, DirWatcher>(StringComparer.OrdinalIgnoreCase);
        static void info()
        {
            Console.WriteLine("filemirror copia automáticamente archivos nuevos y modificados de una ubicación a otra");
            Console.WriteLine("filemirror vars dirs");
            Console.WriteLine("Donde:");
            Console.WriteLine("vars= Archivo con las variables a usar");
            Console.WriteLine("dirs= Directorios que serán supervisados");
        }

        static string replace(IDictionary<string,string> vars,string cad)
        {
            foreach(KeyValuePair<string,string> v in vars)
            {
                cad = cad.Replace(v.Key, v.Value);
            }
            return cad;
        }
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                info();
                return;
            }


            foreach (string l in File.ReadAllLines(args[0]))
            {
                if (!string.IsNullOrWhiteSpace(l.Trim()))
                {
                    if (l.Trim()[0] != '#')
                    {
                        try
                        {
                            vars[l.Split('>')[0].Trim()] = l.Split('>')[1].Trim();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }

            foreach (string l in File.ReadAllLines(args[1]))
            {
                if (!string.IsNullOrWhiteSpace(l.Trim()))
                {
                    if (l.Trim()[0] != '#')
                    {
                        try
                        {
                            string d = replace(vars, l.Split('>')[0].Trim());
                            Console.WriteLine(d);
                            if (Directory.Exists(d))
                                dirs[d] = new DirWatcher(replace(vars, l.Split('>')[0].Trim()), replace(vars, l.Split('>')[1].Trim()));
                            else
                                Console.WriteLine("No existe el directorio.\r\n");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }

            Console.WriteLine("filemirror Ejecutándose...");
            Console.WriteLine("Presione Ctr+C para salir");
            while (true)
            {
                
            }
        }
    }
}
