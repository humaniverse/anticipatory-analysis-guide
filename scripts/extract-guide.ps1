param([Parameter(Mandatory=$true)][string]$InputDocument)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($InputDocument)
function Read-Part([string]$name) {
  $reader = [IO.StreamReader]::new($archive.GetEntry($name).Open())
  try { return [xml]$reader.ReadToEnd() } finally { $reader.Dispose() }
}
function Encode([string]$s) { return [System.Net.WebUtility]::HtmlEncode($s) }
try {
  $xml = Read-Part 'word/document.xml'
  $relationships = Read-Part 'word/_rels/document.xml.rels'
  $links = @{}
  foreach ($rel in $relationships.Relationships.Relationship) {
    if ($rel.Type -like '*/hyperlink' -and $rel.Target -match '^https://') { $links[$rel.Id] = $rel.Target }
  }
  $ns = [Xml.XmlNamespaceManager]::new($xml.NameTable)
  $ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
  $ns.AddNamespace('r','http://schemas.openxmlformats.org/officeDocument/2006/relationships')
  function Inline($node) {
    $parts = @()
    foreach ($child in $node.ChildNodes) {
      if ($child.LocalName -eq 'hyperlink') {
        $id = $child.GetAttribute('id',$ns.LookupNamespace('r'))
        $label = Encode (($child.SelectNodes('.//w:t',$ns) | ForEach-Object InnerText) -join '')
        if ($links.ContainsKey($id)) {
          $suffix = if ($links[$id] -like '*sharepoint.com*') {' <small>(organisation access required)</small>'} else {''}
          $parts += '<a href="' + (Encode $links[$id]) + '" target="_blank" rel="noopener noreferrer">' + $label + '</a>' + $suffix
        } else { $parts += $label }
      } elseif ($child.LocalName -ne 'del') {
        $parts += Encode (($child.SelectNodes('.//w:t',$ns) | ForEach-Object InnerText) -join '')
      }
    }
    return $parts -join ''
  }
  $sections = [Collections.Generic.List[object]]::new()
  $section = $null
  $title = ''
  foreach ($node in $xml.SelectSingleNode('//w:body',$ns).ChildNodes) {
    if ($node.LocalName -eq 'p') {
      $styleNode = $node.SelectSingleNode('w:pPr/w:pStyle',$ns)
      $style = if ($styleNode) {$styleNode.GetAttribute('val',$ns.LookupNamespace('w'))} else {''}
      $plain = ($node.SelectNodes('.//w:t',$ns) | ForEach-Object InnerText) -join ''
      if (!$plain.Trim()) {continue}
      if ($style -eq 'Title') { $title = $plain; continue }
      if ($style -eq 'Heading1') {
        if ($section) { $sections.Add($section) }
        $section = @{id=($sections.Count+1); title=$plain; html=''; text=''}
        continue
      }
      if (!$section) {continue}
      $tag = if ($style -eq 'Heading2') {'h3'} else {'p'}
      $section.html += '<' + $tag + '>' + (Inline $node) + '</' + $tag + '>' + "`n"
      $section.text += $plain + "`n"
    } elseif ($node.LocalName -eq 'tbl' -and $section) {
      $section.html += '<div class="table-scroll"><table>'
      $rowIndex = 0
      foreach ($row in $node.SelectNodes('w:tr',$ns)) {
        $section.html += '<tr>'
        foreach ($cell in $row.SelectNodes('w:tc',$ns)) {
          $tag = if ($rowIndex -eq 0) {'th'} else {'td'}
          $cellHtml = ($cell.SelectNodes('w:p',$ns) | ForEach-Object { Inline $_ }) -join '<br>'
          $section.html += '<' + $tag + '>' + $cellHtml + '</' + $tag + '>'
          $section.text += ($cell.SelectNodes('.//w:t',$ns) | ForEach-Object InnerText) -join ''
          $section.text += "`n"
        }
        $section.html += '</tr>'
        $rowIndex++
      }
      $section.html += '</table></div>'
    }
  }
  if ($section) { $sections.Add($section) }
  $output = @{title=$title; sections=$sections; source='Supplied Word document; body text and resource links only.'} | ConvertTo-Json -Depth 10
  [IO.File]::WriteAllText((Join-Path (Get-Location) 'dist/full-guide.json'), $output, [Text.UTF8Encoding]::new($false))
  Write-Output ('Extracted ' + $sections.Count + ' source sections and ' + $links.Count + ' resource links.')
} finally { $archive.Dispose() }
