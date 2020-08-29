import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  RootRef,
  Backdrop,
  GridListTile,
  GridList,
  GridListTileBar,
  Fab,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
} from '@material-ui/core'
import {
  useDropzone,
  DropzoneInputProps,
  DropzoneRootProps,
} from 'react-dropzone'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import {
  MoveToInboxOutlined,
  Add as AddIcon,
  CloseRounded,
} from '@material-ui/icons'
import { Skeleton, Alert } from '@material-ui/lab'
import { useWindowSize } from 'react-use'
import { v4 } from 'uuid'
import grey from '@material-ui/core/colors/grey'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.appBar - 1,
    },
    inner: {
      borderWidth: 3,
      borderColor: theme.palette.grey[400],
      borderStyle: 'dashed',
      borderRadius: theme.shape.borderRadius,
    },
    upload: {
      display: 'inline-block',
      position: 'relative',
      width: '23rem',
      height: '15rem',
      cursor: 'pointer',
      borderRadius: 0,
    },
    uploadInner: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    firstIcon: {
      color: theme.palette.grey[400],
      fontSize: '6rem',
    },
    icon: {
      fontSize: '10rem',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    titleWrap: {
      margin: 0,
    },
    tile: {
      overflow: 'unset',
    },
    placeholder: {
      backgroundColor: theme.palette.grey[300],
    },
    skeleton: {
      height: '100%',
      transform: 'none',
      borderRadius: 0,
    },
    bottomBar: {
      top: 'auto',
      bottom: 0,
    },
    fab: {
      position: 'fixed',
      right: theme.spacing(2),
      ...(theme.props.MuiToolbar && theme.props.MuiToolbar.variant === 'dense'
        ? {
            bottom: theme.spacing(7.5),
          }
        : {
            bottom: theme.spacing(9.5),
          }),
    },
    alert: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 12,
      ...(theme.props.MuiToolbar && theme.props.MuiToolbar.variant === 'dense'
        ? {
            maxHeight: 31,
            display: 'flex',
            alignItems: 'center',
          }
        : undefined),
    },
    alertIcon: {
      ...(theme.props.MuiToolbar && theme.props.MuiToolbar.variant === 'dense'
        ? {
            padding: 0,
          }
        : undefined),
    },
    alertMessage: {
      ...(theme.props.MuiToolbar && theme.props.MuiToolbar.variant === 'dense'
        ? {
            padding: 0,
          }
        : undefined),
    },
    bottomToolbar: {
      justifyContent: 'space-between',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    backdropBox: {
      borderWidth: 3,
      borderColor: 'inherit',
      borderStyle: 'dashed',
      borderRadius: theme.shape.borderRadius,
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      cursor: 'pointer',
      maxWidth: 380,
      width: '100%',
      maxHeight: 327,
      height: '100%',
    },
    buttonDisabled: {
      color: `${grey[400]} !important`,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  })
)

const DropBox = ({
  inputProps,
  rootProps,
  isDragActive,
  isDragReject,
  variant,
}: {
  inputProps?: DropzoneInputProps
  rootProps?: DropzoneRootProps
  isDragActive: boolean
  isDragReject: boolean
  variant?: 'light' | 'dark'
}) => {
  const classes = useStyles()
  const [tr] = useTranslation('common')

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      className={classes.backdropBox}
      color="inherit"
      style={{ color: variant === 'dark' ? grey[400] : '#fff' }}
      {...rootProps}
    >
      {inputProps && <input {...inputProps} />}
      <MoveToInboxOutlined color="inherit" className={classes.icon} />
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h5" color="inherit">
          {isDragReject
            ? tr('reject')
            : isDragActive
            ? tr('drop')
            : tr('infos')}
        </Typography>
      </Box>
    </Box>
  )
}

export default function Index() {
  const { width } = useWindowSize(500)
  const cols = useMemo(() => Math.max(Math.floor(width / 200), 1), [width])

  const {
    acceptedFiles,
    isDragActive,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    multiple: true,
  })

  const {
    ref,
    onDrop,
    onDragEnter,
    onDragOver,
    onDragLeave,
    ...rootProps
  } = getRootProps()

  const dropProps = {
    onDrop,
    onDragEnter,
    onDragOver,
    onDragLeave,
  }

  const classes = useStyles()

  const [files, setFiles] = useState<
    {
      id: string
      url?: string
      blob?: Blob
      name: string
    }[]
  >([])

  const [errors, setErrors] = useState<string[]>([])

  const convertingCount = useMemo(
    () => files.filter((f) => f.url === undefined).length,
    [files]
  )

  const converting = useMemo(() => convertingCount > 0, [convertingCount])

  const [showErrors, setShowErrors] = useState(false)

  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    ;(async () => {
      const heic2any = (await import('heic2any')).default

      acceptedFiles.forEach(async (file) => {
        const id = v4()

        setFiles((files) => [...files, { id, name: file.name }])
        try {
          const result = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8,
          })
          const blob = Array.isArray(result) ? result[0] : result
          const url = URL.createObjectURL(blob)
          setFiles((files) =>
            files.map((f) => (f.id === id ? { ...f, url, blob } : f))
          )
        } catch (e) {
          setFiles((files) => files.filter((f) => f.id !== id))
          setErrors((errors) => [...errors, file.name])
        }
      })
    })()
  }, [acceptedFiles, setFiles])

  const download = useCallback(async () => {
    setGenerating(true)
    const JSZip = (await import('jszip')).default

    const zip = new JSZip()
    files.forEach((file) => {
      zip.file(`images/${file.name.replace(/.heic$/, '.jpeg')}`, file.blob)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.setAttribute('download', 'images.zip')
    a.setAttribute('href', url)
    a.style.setProperty('display', 'node')

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setGenerating(false)
    setFiles([])
  }, [files, setGenerating, setFiles])

  const theme = useTheme()

  const [tr, i18n] = useTranslation('common')

  useEffect(() => {
    const lang = navigator.language.split('-')[0]
    if (lang === 'fr') {
      i18n.changeLanguage(lang)
    }
  }, [i18n])

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            HEIC
            <Box component="span" color="secondary.main">
              2
            </Box>
            JPEG
          </Typography>
        </Toolbar>
      </AppBar>
      <RootRef rootRef={ref}>
        <Box p={2} flex={1} overflow="auto" {...dropProps}>
          {files.length > 0 && (
            <GridList cellHeight={160} cols={cols} spacing={10}>
              {files.map((file) => (
                <GridListTile key={file.id} cols={1}>
                  {file.url ? (
                    <img src={file.url} />
                  ) : (
                    <Skeleton animation="wave" className={classes.skeleton} />
                  )}

                  <GridListTileBar
                    title={file.name}
                    className={classes.titleBar}
                    titlePosition="bottom"
                  />
                </GridListTile>
              ))}
            </GridList>
          )}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            visibility={files.length > 0 ? 'hidden' : undefined}
            maxHeight={files.length > 0 ? 0 : undefined}
          >
            <DropBox
              isDragActive={isDragActive}
              isDragReject={isDragReject}
              inputProps={getInputProps()}
              rootProps={rootProps}
              variant="dark"
            />
          </Box>

          <Box
            {...rootProps}
            className={classes.fab}
            visibility={files.length === 0 ? 'hidden' : undefined}
            maxHeight={files.length === 0 ? 0 : undefined}
          >
            <Fab>
              <input {...getInputProps()} />
              <AddIcon />
            </Fab>
          </Box>

          <Backdrop
            className={classes.backdrop}
            open={isDragActive && files.length > 0}
          >
            <DropBox
              isDragActive={true}
              isDragReject={isDragReject}
              variant="light"
            />
          </Backdrop>
        </Box>
      </RootRef>

      <Dialog
        open={showErrors}
        onClose={() => setShowErrors(false)}
        scroll="paper"
        fullWidth
      >
        <DialogTitle>
          <Typography component="span" variant="h6">
            {tr('error', { count: errors.length })}
          </Typography>
          <IconButton
            onClick={() => setShowErrors(false)}
            className={classes.closeButton}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {errors.map((_, index) => (
            <Box key={index} my={2}>
              <Alert
                severity="error"
                variant={theme.palette.type === 'dark' ? 'outlined' : undefined}
              >
                {errors[index]}
              </Alert>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrors(false)}>{tr('cancel')}</Button>
          <Button
            onClick={() => {
              setErrors([])
              setShowErrors(false)
            }}
            color="primary"
            variant="contained"
          >
            {tr('clear')}
          </Button>
        </DialogActions>
      </Dialog>

      <AppBar position="relative" className={classes.bottomBar}>
        <Toolbar className={classes.bottomToolbar}>
          {errors.length > 0 ? (
            <Alert
              elevation={1}
              variant="filled"
              severity="error"
              className={classes.alert}
              classes={{
                icon: classes.alertIcon,
                message: classes.alertMessage,
              }}
              action={
                <>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => setShowErrors(true)}
                  >
                    {tr('show')}
                  </Button>
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setErrors([])}
                  >
                    <CloseRounded />
                  </IconButton>
                </>
              }
            >
              {tr('errors-occurred', { count: errors.length })}
            </Alert>
          ) : (
            <Box />
          )}
          <Box display="flex" alignItems="center">
            {(converting || files.length > 0 || generating) && (
              <Box mr={2} display="flex" alignItems="center">
                {(generating || converting) && (
                  <Box
                    mr={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress size={16} />
                  </Box>
                )}
                <Typography>
                  {generating
                    ? tr('generating')
                    : converting
                    ? tr('converting', {
                        count: convertingCount,
                      })
                    : tr('converted', {
                        count: files.length,
                      })}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              disabled={files.length === 0 || converting || generating}
              onClick={download}
              classes={{
                disabled: classes.buttonDisabled,
              }}
            >
              {tr('download-files')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

Index.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
