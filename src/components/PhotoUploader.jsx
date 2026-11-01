import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image, Star } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 10;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_MB = 10;

/**
 * PhotoUploader
 * ─────────────
 * Props:
 *  photos       — array of { file, url, progress, status, isExterior, label }
 *  onChange     — (photos) => void
 *  exteriorIdx  — index of the exterior/building photo
 *  onExteriorChange — (idx) => void
 */
export default function PhotoUploader({ photos, onChange, exteriorIdx, onExteriorChange }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const addFiles = useCallback(async (fileList) => {
    const newFiles = Array.from(fileList).filter(f => {
      if (!ACCEPTED.includes(f.type)) return false;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
      return true;
    });

    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = newFiles.slice(0, remaining);
    if (toUpload.length === 0) return;

    // Add placeholders immediately
    const placeholders = toUpload.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      url: URL.createObjectURL(file),
      progress: 0,
      status: 'pending', // pending | uploading | done | error
      isExterior: false,
      label: file.name,
    }));

    const startIndex = photos.length;
    onChange([...photos, ...placeholders]);

    // Upload each
    for (let i = 0; i < placeholders.length; i++) {
      const globalIdx = startIndex + i;
      const ph = placeholders[i];

      // mark uploading
      onChange(prev => prev.map((p, idx) =>
        idx === globalIdx ? { ...p, status: 'uploading' } : p
      ));

      try {
        const result = await uploadToCloudinary(
          ph.file,
          'technispace/properties',
          (pct) => {
            onChange(prev => prev.map((p, idx) =>
              idx === globalIdx ? { ...p, progress: pct } : p
            ));
          }
        );

        onChange(prev => prev.map((p, idx) =>
          idx === globalIdx
            ? { ...p, url: result.url, publicId: result.publicId, status: 'done', progress: 100 }
            : p
        ));
      } catch (err) {
        onChange(prev => prev.map((p, idx) =>
          idx === globalIdx ? { ...p, status: 'error', errorMsg: err.message } : p
        ));
      }
    }
  }, [photos, onChange]);

  const removePhoto = (idx) => {
    const next = photos.filter((_, i) => i !== idx);
    onChange(next);
    if (exteriorIdx === idx) onExteriorChange(null);
    else if (exteriorIdx > idx) onExteriorChange(exteriorIdx - 1);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const validCount = photos.filter(p => p.status === 'done' || p.status === 'uploading').length;
  const hasExterior = exteriorIdx !== null && exteriorIdx !== undefined;
  const meetsMin = photos.filter(p => p.status === 'done').length >= MIN_PHOTOS;

  return (
    <div>
      {/* Status Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatusPill
          ok={meetsMin}
          label={`${photos.filter(p => p.status === 'done').length} / ${MIN_PHOTOS} min photos`}
        />
        <StatusPill
          ok={hasExterior}
          label={hasExterior ? '✓ Exterior photo set' : 'Mark 1 exterior photo'}
        />
        <StatusPill
          ok={photos.length <= MAX_PHOTOS}
          label={`Max ${MAX_PHOTOS} photos`}
        />
        {!isCloudinaryConfigured && (
          <span style={{
            fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            ⚠ Demo mode — Cloudinary not configured
          </span>
        )}
      </div>

      {/* Drop Zone */}
      {photos.length < MAX_PHOTOS && (
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          style={{ marginBottom: 16, cursor: 'pointer' }}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPTED.join(',')}
            style={{ display: 'none' }}
            onChange={e => addFiles(e.target.files)}
            id="photo-file-input"
          />
          <div className="upload-icon"><Upload size={22} /></div>
          <div className="upload-label">
            Drop photos here or <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>browse files</span>
          </div>
          <div className="upload-hint">
            JPG, PNG, WebP · Max {MAX_SIZE_MB}MB each · {MIN_PHOTOS}–{MAX_PHOTOS} photos required
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
        }}>
          {photos.map((photo, idx) => (
            <PhotoTile
              key={photo.id || idx}
              photo={photo}
              idx={idx}
              isExterior={exteriorIdx === idx}
              onMarkExterior={() => onExteriorChange(idx)}
              onRemove={() => removePhoto(idx)}
            />
          ))}
        </div>
      )}

      {/* Instruction */}
      <div style={{
        marginTop: 16, padding: '12px 14px',
        background: 'rgba(108,71,255,0.06)',
        border: '1px solid rgba(108,71,255,0.15)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--brand-secondary)' }}>📸 Photo Tips:</strong>{' '}
        Upload at least <strong>3 photos</strong> (max 10). One must be the <strong>full exterior / building photo</strong> showing the surrounding area — click the ⭐ star icon on a photo to mark it as the exterior shot. Good lighting and wide angles attract more tenants.
      </div>
    </div>
  );
}

function StatusPill({ ok, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem', fontWeight: 600,
      background: ok ? 'var(--badge-verified-bg)' : 'var(--badge-pending-bg)',
      color: ok ? 'var(--badge-verified-text)' : 'var(--badge-pending-text)',
    }}>
      {ok ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {label}
    </span>
  );
}

function PhotoTile({ photo, idx, isExterior, onMarkExterior, onRemove }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      aspectRatio: '4/3',
      border: isExterior ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
      background: 'var(--bg-elevated)',
    }}>
      {/* Thumbnail */}
      <img
        src={photo.url}
        alt={`Photo ${idx + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.target.style.display = 'none'; }}
      />

      {/* Overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
      }} />

      {/* Progress bar */}
      {(photo.status === 'uploading' || photo.status === 'pending') && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
          <div style={{
            height: '100%', background: 'var(--brand-primary)',
            width: `${photo.progress || 5}%`,
            transition: 'width 0.2s ease',
          }} />
        </div>
      )}

      {/* Error state */}
      {photo.status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(244,63,94,0.85)', color: 'white',
          fontSize: '0.72rem', textAlign: 'center', padding: 8,
        }}>
          <AlertCircle size={18} style={{ marginBottom: 4 }} />
          Upload failed
        </div>
      )}

      {/* Top actions */}
      <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 }}>
        <button
          title="Remove photo"
          onClick={onRemove}
          style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Mark exterior */}
      <button
        title={isExterior ? 'Exterior photo' : 'Mark as exterior photo'}
        onClick={onMarkExterior}
        style={{
          position: 'absolute', top: 6, left: 6,
          width: 26, height: 26, borderRadius: '50%',
          background: isExterior ? 'var(--brand-primary)' : 'rgba(0,0,0,0.55)',
          border: `1.5px solid ${isExterior ? 'white' : 'rgba(255,255,255,0.4)'}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          transition: 'all 0.2s',
        }}
      >
        <Star size={12} fill={isExterior ? 'white' : 'none'} />
      </button>

      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {isExterior && (
          <span style={{
            background: 'var(--brand-primary)', color: 'white',
            fontSize: '0.62rem', fontWeight: 700,
            padding: '2px 7px', borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
          }}>
            EXTERIOR
          </span>
        )}
        {photo.status === 'done' && (
          <span style={{
            background: 'rgba(6,214,160,0.9)', color: 'white',
            fontSize: '0.62rem', fontWeight: 700,
            padding: '2px 7px', borderRadius: 'var(--radius-full)',
          }}>
            ✓ UPLOADED
          </span>
        )}
      </div>
    </div>
  );
}
