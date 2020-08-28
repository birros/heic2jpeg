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
} from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import {
  MoveToInboxOutlined,
  Add as AddIcon,
  CloseRounded,
} from '@material-ui/icons'
import { Skeleton, Alert } from '@material-ui/lab'
import { useWindowSize } from 'react-use'
import { v4 } from 'uuid'

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.appBar - 1,
    },
    inner: {
      borderWidth: 1,
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
      color: theme.palette.common.white,
      fontSize: '10rem',
    },
    drop: {
      color: theme.palette.common.white,
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
      bottom: theme.spacing(10),
      right: theme.spacing(2),
    },
    alert: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 12,
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
  })
)

export default function Index() {
  const { width } = useWindowSize(500)
  const cols = useMemo(() => Math.max(Math.floor(width / 200), 1), [width])

  const {
    acceptedFiles,
    isDragActive,
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

  const loading = useMemo(
    () => files.filter((f) => f.url === undefined).length > 0,
    [files]
  )

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
            quality: 0.5,
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
      zip.file(file.name, file.blob)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    console.log(url)

    setGenerating(false)
    setFiles([])
  }, [files, setGenerating, setFiles])

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
        <Box p={2} flex={1} {...dropProps}>
          {files.length > 0 ? (
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
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Box className={classes.upload} {...rootProps}>
                <Box p={2} className={classes.uploadInner}>
                  <Box
                    className={classes.inner}
                    p={2}
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <input {...getInputProps()} />
                    <Box
                      flex={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MoveToInboxOutlined
                        fontSize="large"
                        className={classes.firstIcon}
                      />
                    </Box>
                    <Typography color="textSecondary">
                      {isDragActive ? (
                        <>Drop files to convert</>
                      ) : (
                        <>Click or drag files to this area to convert</>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          <Box {...rootProps} className={classes.fab}>
            <Fab color="secondary">
              <input {...getInputProps()} />
              <AddIcon />
            </Fab>
          </Box>

          <Backdrop
            className={classes.backdrop}
            open={isDragActive && files.length > 0}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <MoveToInboxOutlined className={classes.icon} />
              <Typography variant="h5" color="inherit" className={classes.drop}>
                Drop files to convert
              </Typography>
            </Box>
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
            {errors.length} Error{errors.length > 1 && 's'}
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
              <Alert severity="error">{errors[index]}</Alert>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrors(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setErrors([])
              setShowErrors(false)
            }}
            color="secondary"
            variant="contained"
          >
            Clear
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
              action={
                <>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => setShowErrors(true)}
                  >
                    SHOW
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
              {errors.length} Error{errors.length > 1 && 's'} have occurred
            </Alert>
          ) : (
            <Box />
          )}
          <Box display="flex" alignItems="center">
            {!loading && files.length > 0 && (
              <Box mr={2}>
                <Typography>{files.length} files converted</Typography>
              </Box>
            )}

            <Button
              variant="contained"
              color="secondary"
              disabled={files.length === 0 || loading}
              onClick={!generating ? download : undefined}
              startIcon={generating && <CircularProgress size={24} />}
            >
              DOWNLOAD FILES
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
