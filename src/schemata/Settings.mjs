import schisma from 'schisma'

export const PacketsSchema = schisma({
  entries: [String],
})

export const FilesSchema = schisma({
  files: [String],
  dirs: [String],
  selectedFileID: String,
  currentDir: String,
  lastIndex: Number,
  selectedIndex: Number,
})

export const WindowSchema = schisma({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  fullscreen: Boolean,
  maximized: Boolean,
})

export const SectionsSchema = schisma({
  "$/.*": [Boolean],
})

export const GeneralSchema = schisma({
  colorMode: String,
})

const SettingsSchema = schisma({
  win: WindowSchema,
  packets: PacketsSchema,
  openFiles: FilesSchema,
  general: GeneralSchema,
  sections: SectionsSchema,
})

export default SettingsSchema